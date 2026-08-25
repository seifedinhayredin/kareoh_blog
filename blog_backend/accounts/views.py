# accounts/views.py

from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
from django.middleware.csrf import get_token
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect


from .models import User
from .serializers import UserSerializer, LoginSerializer,ChangePasswordSerializer

@method_decorator(csrf_protect, name="dispatch")
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@method_decorator(csrf_protect, name="dispatch")
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            "user": UserSerializer(user).data,
            "message": "Login successful",
        })

        response.set_cookie(
            key="access_token",
            value=str(access),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=15 * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response

class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)    



@method_decorator(csrf_protect, name="dispatch")
class RefreshAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(
            data={"refresh": refresh_token}
        )

        try:
            serializer.is_valid(raise_exception=True)

        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        access_token = serializer.validated_data["access"]

        response = Response({
            "message": "Tokens refreshed successfully."
        })

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,       # True in production with HTTPS
            samesite="Lax",
            max_age=15 * 60,
        )

        # If rotation is enabled, Simple JWT returns a new refresh token
        if "refresh" in serializer.validated_data:
            response.set_cookie(
                key="refresh_token",
                value=serializer.validated_data["refresh"],
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=7 * 24 * 60 * 60,
            )

        return response


@method_decorator(csrf_protect, name="dispatch")
class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = Response({
            "message": "Logout successful."
        })

        response.delete_cookie(
            "access_token",
            samesite="Lax",
        )

        response.delete_cookie(
            "refresh_token",
            samesite="Lax",
        )

        return response




class CSRFTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)

        response = Response({
            "csrfToken": csrf_token
        })

        response.set_cookie(
            key="csrftoken",
            value=csrf_token,
            httponly=False,
            secure=False,
            samesite="Lax",
        )

        return response

@method_decorator(csrf_protect, name="dispatch")
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        # Change the password using Django's password hashing
        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save(
            update_fields=["password"]
        )

        # Invalidate the current refresh token
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        # Remove authentication cookies
        response = Response({
            "message": (
                "Password updated successfully. "
                "Please log in again."
            )
        })

        response.delete_cookie(
            "access_token",
            samesite="Lax",
        )

        response.delete_cookie(
            "refresh_token",
            samesite="Lax",
        )

        return response
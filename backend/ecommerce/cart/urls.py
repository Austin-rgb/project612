from django.urls import path
from .views import *

urlpatterns = [
    path('add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('remove/<int:product_id>/', remove_from_cart, name='remove_from_cart'),
    path('detail/', cart_detail, name='cart_detail'),
    ]
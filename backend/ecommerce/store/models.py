from django.db import models
from django.contrib.auth.models import User 
from .storage import NonLockingFileSystemStorage

non_locking_storage = NonLockingFileSystemStorage()

class Category (models.Model):
    name = models.CharField(max_length=16)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

class ServiceItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE,default='general')
    name = models.CharField(max_length=200)
    owner = models.ForeignKey (User, on_delete =models.CASCADE )
    description = models.TextField()
    posted = models.DateTimeField(auto_now=True)
    available= models.BooleanField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    class Meta: 
        abstract = True
    

class ProductItem(ServiceItem):
    image = models.ImageField(upload_to='product_images/', null=True, blank=True, storage=non_locking_storage)
    image1 = models.ImageField(upload_to='product_images/', null=True, blank=True,storage=non_locking_storage)
    image2 = models.ImageField(upload_to='product_images/', null=True, blank=True,storage=non_locking_storage)
    image3 = models.ImageField(upload_to='product_images/', null=True, blank=True,storage=non_locking_storage)
    stock = models.IntegerField()
    
    def __str__(self):
        return self.name

    def take(self,order,quantity ): 
        self.stock-=quantity
        orderitem = OrderItem(
            order=order,
            item=self,
            quantity= quantity 
        )
        orderitem.save()
    
    class Meta:
        abstract =True 

class Product(ProductItem):
    delivery = models.CharField(max_length=32)
    

from datetime import datetime

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='OrderItem')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    reference_code = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=datetime.now)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()


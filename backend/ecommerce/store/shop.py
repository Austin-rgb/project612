from .models import Order, Product
import random
import string
from peitrak.models import PendingTransaction
class Payment:
    def __init__(self) -> None:
        self.payments = {}

    def confirm (self,ref_code:str,user)->float:
        transaction = PendingTransaction.objects.get(ref_code=ref_code,source=user)
        return transaction.amount


class Shelf:
    def __init__(self, payment=Payment()) -> None:
        self.payment = payment    
    
    def buy(self,cart,payment_id,user_id)->bool:
        cart_items = cart.items.all()
        total_price = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(user=cart.user, total_price=total_price, reference_code=payment_id)
        for item in cart_items:
            if item.product.take(order, item.product.quantity):
                order.products.add(item.product, through_defaults={'quantity': item.quantity})
            
            cart.items.all().delete()
            order.save()
            return True
        return False

    def update_stock(self,item_id, quantity):
        product = Product.objects.get(id=item_id)
        product.stock += quantity

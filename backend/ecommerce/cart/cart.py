
class Cart:
    def __init__(self,request ):
        self.request = request 
        
	def add(self, product_id):
	    
	    if self.request.user.is_authenticated:
		cart, created = Cart.objects.get_or_create(user=self.request.user)
		cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product_id)
		if not created:
		    cart_item.quantity += 1
		cart_item.save()
	    else:
		cart = request.session.get('cart', {})

		if str(product_id) in cart:
		    cart[str(product_id)]['quantity'] += 1
		else:
		    cart[str(product_id)] = {
		        'product_id': product_id,
		        'name': product.name,
		        'price': str(product.price),
		        'quantity': 1,
		    }

		self.request.session['cart'] = cart

	    
	def remove(self,product_id):
		
		if self.request.user.is_authenticated: 
		    cart = Cart.objects.get(user=request.user)
		    cart_item= CartItem.objects.get(cart=cart, product_id=product_id)
		    cart_item.delete()

		else:
		    cart = self.request.session.get ('cart',{})
		    cart = {}
		    cart.pop(str(product_id),None)
		
    def update_quantity(self, product_id,new_quantity=1):
        n_quantity = request.POST.get('quantity', 1)
        if not n_quantity:n_quantity=request.GET.get('quantity')
        if n_quantity: 
            new_quantity = n_quantity
            
        if self.request.user.is_authenticated:
            cart_item = get_object_or_404(CartItem, cart__user=request.user, product_id=product_id)
            cart_item.quantity = new_quantity
            cart_item.save()
        else:
            cart = self.request.session.get('cart', {})
            if str(product_id) in cart:
                cart[str(product_id)]['quantity'] = new_quantity
                self.request.session['cart'] = cart
                
    def detail(self):
		if self.request.user.is_authenticated:
		    cart, created = Cart.objects.get_or_create(user=self.request.user)
		    cart_items = cart.items.all()
		    total_price = sum(item.product.price * item.quantity for item in cart_items)
		else:
		    cart = self.request.session.get('cart', {})
		    cart_items = []
		    total_price = 0
		    for item in cart.values():
		        total_price += float(item['price']) * item['quantity']
		        cart_items.append({
		            'product_id': item['product_id'],
		            'name': item['name'],
		            'price': float(item['price']),
		            'quantity': item['quantity']
		        })

		return cart_items 

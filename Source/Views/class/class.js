class Product {
    constructor(id, title, category, price, platform, img, description,quantity) {
        this.id = id;
        this.title = title ;
        this.category = category ;
        this.price = price ;
        this.platform = platform ;
        this.img = img;
        this.description= description;
        this.quantity= quantity;
    }
}

class Order {
    constructor(id,cid,c_name,c_address,c_phone,subtotal,items,date,status,payment){
        this.id = id;
        this.cid =cid;
        this.c_name= c_name;
        this.c_address = c_address;
        this.c_phone = c_phone;
        this.subtotal = subtotal;
        this.items = items;
        this.date =date;
        this.status =status;
        this.payment = payment;
    }
}
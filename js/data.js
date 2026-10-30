const DEFAULT_CATEGORIES = [
 {id:"fashion",name:"পোশাক ও ফ্যাশন",icon:"👕"},{id:"gadgets",name:"মোবাইল ও গ্যাজেট",icon:"📱"},
 {id:"computer",name:"ল্যাপটপ ও কম্পিউটার",icon:"💻"},{id:"home",name:"হোম ডেকর",icon:"🛋️"},
 {id:"beauty",name:"বিউটি ও পার্সোনাল কেয়ার",icon:"💄"},{id:"appliance",name:"রান্নাঘর ও হোম অ্যাপ্লায়েন্স",icon:"🍳"},
 {id:"sports",name:"খেলাধুলা ও আউটডোর",icon:"⚽"},{id:"toys",name:"খেলনা",icon:"🧸"},
 {id:"books",name:"বই ও স্টেশনারি",icon:"📚"},{id:"tools",name:"টুলস ও হার্ডওয়্যার",icon:"🛠️"}
];
const DEFAULT_PRODUCTS = [
 {id:101,name:"ওয়্যারলেস ইয়ারবাড",category:"gadgets",price:1290,oldPrice:1590,image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=500&q=80",description:"পরিষ্কার সাউন্ড ও দীর্ঘ ব্যাটারি ব্যাকআপ।"},
 {id:102,name:"স্মার্ট ওয়াচ",category:"gadgets",price:2490,oldPrice:3190,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",description:"দৈনন্দিন ব্যবহারের স্মার্ট ঘড়ি।"},
 {id:103,name:"প্রিমিয়াম ব্যাকপ্যাক",category:"fashion",price:1490,oldPrice:1990,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",description:"ভ্রমণ ও দৈনন্দিন ব্যবহারের জন্য।"},
 {id:104,name:"ক্যাজুয়াল শার্ট",category:"fashion",price:890,oldPrice:1090,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",description:"আরামদায়ক কাপড়ের আধুনিক শার্ট।"},
 {id:105,name:"স্পোর্টস জুতা",category:"sports",price:1890,oldPrice:2390,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",description:"হালকা ও আরামদায়ক স্পোর্টস জুতা।"},
 {id:106,name:"ইনডোর প্ল্যান্ট",category:"home",price:490,oldPrice:650,image:"https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80",description:"ঘর সাজানোর সুন্দর গাছ।"},
 {id:107,name:"ডিজিটাল ক্যামেরা",category:"gadgets",price:15900,oldPrice:17900,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",description:"স্মৃতি ধরে রাখুন সুন্দরভাবে।"},
 {id:108,name:"ল্যাপটপ",category:"computer",price:48900,oldPrice:52900,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",description:"কাজ ও পড়াশোনার জন্য উপযোগী।"},
 {id:109,name:"স্কিন কেয়ার সেট",category:"beauty",price:990,oldPrice:1250,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80",description:"প্রতিদিনের ত্বকের যত্নে।"},
 {id:110,name:"কফি মগ",category:"home",price:350,oldPrice:450,image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80",description:"সুন্দর ডিজাইনের সিরামিক মগ।"}
];
const Store = {
 read(key,fallback){try{const v=localStorage.getItem("futpat_"+key);return v?JSON.parse(v):fallback}catch(e){return fallback}},
 write(key,value){localStorage.setItem("futpat_"+key,JSON.stringify(value))},
 categories(){return this.read("categories",DEFAULT_CATEGORIES)},
 products(){return this.read("products",DEFAULT_PRODUCTS)},
 cart(){return this.read("cart",[])},
 orders(){return this.read("orders",[])},
 money(n){return "৳"+Number(n||0).toLocaleString("bn-BD")},
 digits(n){return Number(n||0).toLocaleString("bn-BD")},
 addCart(id){let c=this.cart();let item=c.find(x=>x.id==id);if(item)item.qty++;else c.push({id:Number(id),qty:1});this.write("cart",c)},
 cartCount(){return this.cart().reduce((s,x)=>s+x.qty,0)},
 cartDetails(){return this.cart().map(c=>{let p=this.products().find(x=>x.id==c.id);return p?{...p,qty:c.qty}:null}).filter(Boolean)},
 total(){return this.cartDetails().reduce((s,p)=>s+p.price*p.qty,0)}
};

"use client"
import Header from '@/components/Header';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert]= useState("")
  const [loading, setLoading]= useState(false)
  const [loadingaction, setLoadingaction]= useState(false)
  const [query, setQuery]= useState("")

  const [dropdown, setDropdown] = useState([ ])
  useEffect( () =>{
    const fetchProducts = async () =>{
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])
  const buttonAction = async(action, slug, initialQuantity) => {
    let index = products.findIndex((item)=> item.slug == slug)
    console.log(index)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus"){
      newProducts[index].quantity = parseInt(initialQuantity) + 1
      console.log(newProducts[index].quantity)
    }
    else{
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)

    let indexdrop = dropdown.findIndex((item)=> item.slug == slug)

    console.log(indexdrop, "parse")
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
      console.log(newDropdown[indexdrop].quantity)
    }
    else{
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)

    console.log(action, slug)
    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action, slug, initialQuantity}),
    });
    let r = await response.json()
    console.log(r)
    setLoadingaction(false)
  }
   

  
  const addProduct = async (e) => {

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Successful response, you might want to update your local state or perform other actions
        console.log('Product added successfully');
        setAlert("Your Product has been added!");
        alert("Your Product has been added!")
        setProductForm({})
      } else {
        // Handle error cases
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
    const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
      e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) =>{
    let value = e.target.value
    setQuery(value)

    if(value.length>3){
      setLoading(true)
      setDropdown([])
    const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else{
      setDropdown([])
    }
  }

  // Dummy data for demonstration, replace it with your actual stock data
  //const stockData = [
    //{ id: 1, productName: 'Product 1', quantity: 10, price: '$19.99' },
   // { id: 2, productName: 'Product 2', quantity: 20, price: '$9.99' },
    // Add more entries as needed
  //];

  return (
    <>
      <Header />
      <div className='container my-8  mx-auto'>
        
      <div className='text-green-800 text-center '>{alert}</div>
      <div className='flex items-start justify-start mb-4'>
        <img src='search.gif' alt='search' width={50} height={50} className='mr-2'/>
        <h1 className="text-3xl font-semibold mb-4">Search a product</h1>
      </div>
        
        {/* Search input and dropdown */}
        
        <div className="flex items-center mb-2">
          <input
            
            onChange={onDropdownEdit}
            type="text"
            id="searchProduct"
            name="searchProduct"
            placeholder="Enter product name"
            className="w-full border p-2 mr-2"
            // Add necessary state or onChange handlers
          />
        </div>
        {loading && <div className='flex justify-center items-center w-20'><img src='loading.gif' alt='search' width={50} height={50}/> </div>

 }
 <div className='dropcontainer absolute w-[89.5vw]  border-1 bg-teal-100 rounded-md mb-4'>
        {dropdown.map(item=>{
            return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
              <slug className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</slug>
              <div className='mx-5'>
              <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} disabled={loadingaction} className="subtract inline-block px-4 py-1 bg-black text-white font-semibold rounded-lg shadow-md cursor-pointer  disabled:bg-gray-200">-</button>
              <slug className="quantity inline-block w-10 mx-10">{item.quantity}</slug>
              <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} disabled={loadingaction} className="add inline-block px-4 py-1 bg-black text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-gray-200">+</button>
              </div>
              </div> 
            })}
           </div> 
           
      {/* Display Current Stock */}
      <div className='container  mx-auto my-8'>
      <div className='flex items-start justify-start mb-4'>
      <img src='add.gif' alt='add' width={50} height={50} className='mr-2'/>
        <h1 className="text-3xl font-semibold mb-4">Add a product</h1>
        </div>

        {/* Form for adding products */}
        <div className='border border-black rounded-md p-4'>
        <form className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="productName">
            Product Slug
          </label>
          <input value={productForm?.slug || ""}
            onChange={handleChange}
            type="text"
            id="productName"
            name="slug"
            className="w-full border p-2 mb-2"
            // Add necessary state or onChange handlers
          />

          <label className="block text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input value={productForm?.quantity || ""}
            onChange={handleChange}
            type="number"
            id="quantity"
            name="quantity"
            className="w-full border p-2 mb-4"
            // Add necessary state or onChange handlers
          />

          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input value={productForm?.price || ""}
            onChange={handleChange}
            type="text"
            id="price"
            name="price"
            className="w-full border p-2 mb-4"
            // Add necessary state or onChange handlers
          />

          <button
            onClick={addProduct}
            type="submit"
            className="bg-teal-300 text-black p-2 rounded"
            // Add necessary onSubmit handler
          >
            Add Product
          </button>
        </form>
        </div>
      </div>

      {/* Search and Display sections */}
      
        <div className='cointainer my-8 mx-auto'>
        <div className='flex items-start justify-start mb-4'> 
        <img src='display.gif' alt='add' width={50} height={50} className='mr-2'/>
        <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>
        </div>
        <div className='border border-black rounded-md p-4'>
        {/* Table for displaying stock */}
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return <tr key={product.slug}>
                <td className="border px-4 py-2 ">{product.slug}</td>
                <td className="border px-4 py-2 ">{product.quantity}</td>
                <td className="border px-4 py-2 ">₹{product.price}</td>
              </tr>
            })}
          </tbody>
        </table>
        </div>
        </div>
      </div>
    </>
  );
}



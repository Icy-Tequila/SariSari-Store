import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ name: "", description: "", price: "", stock: "", image: null });
      setPreview(null);
      fetchProducts();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5000/api/products/all");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 mx-auto font-sans bg-pink-200 h-full">
      <div className="grid lg:grid-cols-[2fr_3fr] gap-5">
      <div className="">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📦 Product Dashboard
      </h1>

      <div className="bg-white p-6 lg:h-[520px] rounded-xl shadow-md mb-10 self-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="col-span-1 md:col-span-2 border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-700"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-24 h-24 object-cover rounded border"
              />
            )}
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-pink-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Add Product
          </button>
        </form>
      </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md h-[520px] overflow-y-auto lg:mt-15">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Product List
        </h2>
        <div className="overflow-x-auto h-full">
          <table className="min-w-full  table-auto border-collapse text-sm text-gray-700">
            <thead>
              <tr className="bg-pink-100 text-left text-pink-800">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Stock</th>
                <th className="p-3 font-semibold">Image</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.description}</td>
                  <td className="p-3">PHP{p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    {p.image && (
                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No products found.
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;

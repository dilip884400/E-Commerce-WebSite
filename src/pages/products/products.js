import React, { useEffect, useState } from "react";
import { FakeStoreApi } from "../../services/fake-store-api";
import { useSearchParams } from "react-router-dom";
import { Item } from "../../components/item";
import { useCart } from "../../context/cart";
import "./products.css";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [query] = useSearchParams();
  const { addToCart } = useCart();
  const searchQuery = query.get("q");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let fetchedProducts;
      if (searchQuery) {
        fetchedProducts = await FakeStoreApi.fetchProductsBySearchQuery(
          searchQuery
        );
      } else {
        fetchedProducts = await FakeStoreApi.fetchAllProducts();
      }
      setProducts(fetchedProducts);
      setOriginalProducts(fetchedProducts); // Store original products
      setLoading(false);
    };

    fetchProducts().catch(console.error);
  }, [searchQuery]);

  const filterCategory = (category) => {
    const filteredProducts = originalProducts.filter(
      (product) => product.category === category
    );
    setProducts(filteredProducts);
  };

  const resetFilter = () => {
    setProducts(originalProducts);
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    if (selectedOption === "asc") {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setProducts(sortedProducts);
    } else if (selectedOption === "desc") {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setProducts(sortedProducts);
    }
  };

  if (!loading && searchQuery && !products.length) {
    return (
      <div className="container">
        <div className="product py-2">
          <div className="details p-3">
            No products found matching your query.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="categorys-products">
        <ul>
          <li onClick={resetFilter}>All</li>
          <li onClick={() => filterCategory("men's clothing")}>Men</li>
          <li onClick={() => filterCategory("women's clothing")}>Women</li>
          <li onClick={() => filterCategory("jewelery")}>Jewelry</li>
          <li onClick={() => filterCategory("electronics")}>Electronics</li>
        </ul>
      </div>
      <div className="sort-container">
        <label htmlFor="sort-select" className="sort-price">Sort by Price: </label>
        <select id="sort-select" value={sortOption} onChange={handleSortChange}>
          <option value="">None</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>
      <div className="products my-5">
        <div className="grid">
          {loading ? (
            <div className="loader" />
          ) : (
            products.map((product) => (
              <Item
                key={product.id}
                data={product}
                addToCart={() => addToCart(product)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { Products };

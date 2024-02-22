import { useState, useEffect } from 'react';
// import initialProducts from "../data/db.json"; // ya no usamos un archivo local
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:3000/products";

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [editedProduct, setEditedProduct] = useState({
        id: null,
        title: "",
        price: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data);
                
                
                // Simular un error 404 al obtener los productos
                // const errorResponse = { response: {status: 404} };
                // throw await Promise.reject(errorResponse);


                // Simular un error 400
                // const errorResponse = { response: {status: 400} };
                // throw await Promise.reject(errorResponse);

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError("No products");
                } else {
                    setError("Error fetching products");
                }
            } finally {
                // simular tiempos de carga
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };
        getProducts();
    }, []);
/*
    const getProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    }
*/
    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${API_URL}/${id}`);
            // FORMA 2: suponemos que no hay nadie que está modificando la tabla también. 
                // NO es buena opción para varios usuarios a la vez en la red realizando cambios 
            setProducts((prevProducts) => 
                prevProducts.filter((product) => product.id !== id)
            );
            // FORMA 1: más lenta (+ peticiones a api), pero nos aseguramos de no perder datos entre peticiones de usuarios
            //getProducts();
        } catch (error) {
            console.error("Error deleting product", error);
        }
        setLoading(false);
    }

    const handleSave = () => {
        if (editedProduct.id != null) {
            editProduct();
        } else {
            createProcuct();
        }
    }

    const createProcuct = async () => {
        try {
            const newId = uuidv4();
            const newProduct = { ...editedProduct, id: newId };
            const response = await axios.post(API_URL, newProduct);
            setProducts((prevProducts) => [...prevProducts, response.data]);
            setEditedProduct({ id: null, title: "", price: "" });
        } catch (error) {
            console.error("Error adding product", error);
        }
    };

    const editProduct = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/${editedProduct.id}`,
                editedProduct
            );
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === response.data.id ? response.data : product
                )
            );
        } catch (error) {
            console.error("Error updating product", error);
        }
    };
    
    /* ESTO ERA EN LOCAL 

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handleEdit = (id, title, price) => {
        setEditedProduct({id, title, price});
    };
   
    const handleSave = () => {
        if (editedProduct.id != null) {
            const index = products.findIndex(
                (product) => product.id === editedProduct.id
            );
            products[index] = editedProduct;
            setProducts([...products]);
        } else {
            setProducts([...products, {...editedProduct, id: products.length + 1}]);
        }
        setEditedProduct({id: null, title: "", price: ""});
    };
    */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleEditProductDetails = (id, title, price) => {
        const selectedProduct = products.find((product) => product.id === id);
        setEditedProduct({ ...selectedProduct, title, price });
    }


    return {
        products,
        editedProduct,
        deleteProduct,
        handleInputChange, 
        handleSave,
        handleEditProductDetails,
        loading,
        error
    }

}
export default useProducts;
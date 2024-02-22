import React, { useEffect } from 'react';
import useProducts from "../hooks/useProducts";

const Loader = () => {
    return <div className='spinner'>Cargando...</div>;
};

const Tabla = () => {
    const { 
        products, 
        editedProduct,
        deleteProduct,
        handleEditProductDetails,
        handleSave, 
        handleInputChange,
        loading,
        error,
        setError,
    } = useProducts();

    // useEffect solo se ejecuta cuando se ha modificado el estado de error
    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [setError]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h2>Editar Producto</h2>
            <div>
                <input 
                type="text"
                placeholder="Título del Producto"
                name='title'
                value={editedProduct.title}
                onChange={handleInputChange}
                />
                <input 
                type="text"
                placeholder="Precio del Producto"
                name='price'
                value={editedProduct.price}
                onChange={handleInputChange}
                />
                <button onClick={handleSave}>
                    {editedProduct.id != null ? "Guardar" : "Añadir"}
                </button>
            </div>
            <h1>Lista de productos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>title</th>
                        <th>price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => handleEditProductDetails(product.id, product.title, product.price)}>
                                Editar
                            </button>
                            <button onClick={() => deleteProduct(product.id)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </div>
    )

}
export default Tabla;
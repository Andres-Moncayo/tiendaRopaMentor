let todosProductos = []; // Todos los productos Impresos
let todosFiltrados = [];
let productSelected = []; // Productos que han seleccionado
let totalProductSelected = []; // Cantidad Individual de un Producto Seleccionado

export const CART = () => ({
  all: todosProductos,
  filtered: todosFiltrados,
  selected: productSelected,
});

/**
 * @param apiUrl - string
 * @returns { Promise<{success: true, data: any[]} | { success: false, error: any }> }
 */
export const getStock = async (apiUrl) => {
  try {
    const respuesta = await fetch(apiUrl);

    if (!respuesta.ok)
      throw new Error("API FAILED", { cause: respuesta.statusText });

    const stock = await respuesta.json();

    return {
      success: true,
      data: stock,
    };
  } catch (error) {
    console.error("Error cargando productos:", error.message);
    return {
      success: false,
      error: {
        error: error.message,
        cause: error.cause,
      },
    };
  }
};

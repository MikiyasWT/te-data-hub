


import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Table from '../components/Table';
import { ProductData, importProduct } from '../services/product';
import { RootState } from '../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { productSearch } from '../services/search';
import debounce from 'lodash.debounce';
import Modal from "react-modal";
import { filterProductsApi } from '../services/filter';

const Product: React.FC = () => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; 

  //productSearch
  const [isError,setIsError] = useState("")
  
  const dispatch = useDispatch();
  const [selectedProductFilters, setSelectedProductFilters] = useState<any>({});
  
  const query = useSelector((state: RootState) => state.query);
  const productsFilters = useSelector((state: RootState) => state.productFilter);


  useEffect(() => {
    setSelectedProductFilters(productsFilters);
  }, [productsFilters]);

  const searchProducts = async () => {
    try {
      const response = await productSearch(query);
  
      setProducts(response.data.products);
      
    } catch (error) {
      setProducts([]);
      setIsError("Nothing that matchs your search was found")
    }
  };

  const debouncedProductsSearch = useCallback(
    debounce(searchProducts, 200),
    [searchProducts, query]);


  const fetchProducts = async () => {
    try {
      
      const response = await ProductData(currentPage, itemsPerPage);
     
      setProducts(response.products);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Unable to fetch products:', error);
    }
  };


  const filterProducts = async () => {
    
    try {
      
      const response = await filterProductsApi(productsFilters,currentPage,itemsPerPage);
      if(response.success){
        console.log()
        setProducts(response.products)
        setTotalItems(response.totalItems);
      }
    } catch (error) {
      setProducts([]);
      setIsError("Nothing that matchs your search was found")
      console.error("Unable to fetch filtered products:", error);
    }
  };



  useEffect(() => {

    if(query != '' || query || query.length>=2){
      debouncedProductsSearch()
    }
    else if(Object.values(productsFilters).length > 0){
      setIsError('')
      filterProducts()
    }
    else{
      setIsError('')
      fetchProducts();;
    }
  },  [query,productsFilters,currentPage]);



  const columns = [
    { header: 'Drug Shop Number', accessor: 'kenema_pharmacy_drug_shop_number' },
    { header: 'Description', accessor: 'description' },
    { header: 'Item Code', accessor: 'item_code' },
    { header: 'Batch Number', accessor: 'batch_number' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Brand', accessor: 'brand' },
    { header: 'Manufacturer', accessor: 'manufacturer' },
    { header: 'Expiration Date', accessor: 'exp' },
    { header: 'VAT', accessor: 'vat' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Unit Selling Price', accessor: 'unit_selling_price' },
    { header: 'Total Selling Price', accessor: 'total_selling_price' },
  ];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await importProduct(file);
  
      const data =  response;
  
      console.log('Import successful', data);
  
    } catch (error) {
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };
 
 

  return (
    <div>
      <h1>Product List</h1>

      <Table data={products} 
      columns={columns}
      currentPage={currentPage} 
      onPageChange={handlePageChange} 
      onRowClick={null} 
      totalItems={totalItems} 
      itemsPerPage={itemsPerPage}
      onImport={handleImport}
      />
       {isError!='' && isError.length>1 &&  <h1 className="text-black">{isError}</h1>}
      
    </div>
  );
};

export default Product;
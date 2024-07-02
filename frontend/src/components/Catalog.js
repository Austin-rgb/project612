import React, { useState, useEffect } from 'react';
import Catalog from "react-catalog-view";
import ReactPaginate from 'react-paginate';

import axios from 'axios';
import { Container, Spinner, Alert } from 'react-bootstrap';
import './ProductList.css'

function CatalogView({ products }) {
   const CONTENT_KEYS =
   {
      imgKey: "image",
      cardTitleKey: "name",
      cardDescriptionKey: "description",
      priceKey: "price",
   };

   return (
      <Catalog
         data={products}
         // Array of JSON Objects (required)
         contentKeys={CONTENT_KEYS}
         // JSON Object defining the keys that will be 
         // used from the data array, keys should match. (required)
         skeleton={0}
         // Any non zero number will override default cards
         // and will show that many skeleton cards.           
         cardSize="sm"
         // Card sizes, sm, md and lg for small, medium  and large
         btnOneText="View"
         // Enter text for action button one 
         // or pass empty string to hide.  
         btnTwoText="Purchase Now"
         // Enter text for action button two 
         // or pass empty string to hide.
         btnOneHandler={(args, event, objectData) => {
            // 'objectData' returns object data from 'data' prop
            // any arguments passed will be before 'event' 
            // and 'objectData'
         }}
         btnTwoHandler={(args, event, row) => {
            // 'objectData' returns object data from 'data' prop
            // any arguments passed will be before 'event' 
            // and 'objectData'
         }}
         imageClickHandler={(args, event, row) => {
            // 'objectData' returns object data from 'data' prop
            // any arguments passed will be before 'event' 
            // and 'objectData'
         }}
         cardControls={dataObj => {
            return (
               <div>
                  <input className='my-custom-input' placeholder='custom-input' />
                  <button className='my-custom-button' type='submit'> OK </button>
               </div>
            )
         }
            // Pass a function which returns JSX to be rendered inside card
            // This function will have 'dataObj' containing JSON of
            // the item each card represents
         }
      />
   )
}

const ProductList = ({ products }) => {
   const itemsPerPage = 10;
   const [currentItems, setCurrentItems] = useState([]);
   const [pageCount, setPageCount] = useState(0);
   const [itemOffset, setItemOffset] = useState(0);

   React.useEffect(() => {
      // Fetch products in the selected page
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(products.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(products.length / itemsPerPage));
      // eslint-disable-next-line
   }, [itemOffset, itemsPerPage]);

   const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % products.length;
      setItemOffset(newOffset);
   };

   return (
      <div>
         <CatalogView products={currentItems} />
         <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
         />
      </div>
   );
};

function ProductData(props) {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await axios.get('http://localhost:8000/api/products/');
            setProducts(response.data);
            setLoading(false);
         } catch (err) {
            setError(err.message);
            setLoading(false);
         }
      };

      fetchProducts();
   }, []);

   if (loading) {
      return (
         <Container className="d-flex justify-content-center mt-5">
            <Spinner animation="border" />
         </Container>
      );
   }

   if (error) {
      return (
         <Container className="d-flex justify-content-center mt-5">
            <Alert variant="danger">{error}</Alert>
         </Container>
      );
   }
   return (
      <ProductList products={products} />
   )
}

export default ProductData;

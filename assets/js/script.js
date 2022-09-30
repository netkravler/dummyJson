/** ApiData is the container for the full products array, it is the main array
 * we are only using this to get data once the page is loaded. after this the
 * array will be used instead of fetch
 * it will prevent extra http requests as long as the array is not empty.
 *
 */
const ApiData = [];

/**  temperay array for handling data when swithing between categories, brands
 *    and others...
 *   the array is emptied before pushing new content into it.
 *    this is the array we are going to loop over.
 */

const TempArr = [];

/** our ApiEndPoint */
const ApiEndPoint = "https://dummyjson.com/products?limit=100";

const fetchProducts = () => {
  fetch(ApiEndPoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //** spread the products and push them to the array */
      ApiData.push(...data.products);
    })
    .catch((error) => {
      //** send an error to the console if the promise is rejected */
      console.error(error);
    })
    .finally(() => {
      //*run the function renderProducts() if the promise is resolved
      renderProducts();
    });
};

const initPage = () => {
  /**
   * by using a ternary operater we can determine if our ApiData is empty or not.
   * if the length of the array is 0 it is empty, hense we are calling the fetchProducts function
   * else we are calling the renderProducts function.
   */
  ApiData.length === 0 ? fetchProducts() : renderProducts();

  /**
   * Svarer til
   * if(ApiData.length === 0){
   * fetchProducts()
   * }else
   * {renderProducts()}
   */
};

//** render all products */
const renderProducts = (array) => {
  /** checks if the incomming property array is undefined or not
   * if it is the ArrayData variable is set to the original Apidata else it is set to
   * the value of the incomming array
   */

  let ArrayData = array !== undefined ? array : ApiData;
  //** clear the root for new incomming html  */
  document.getElementById("root").innerHTML = "";
  //** map through the ArrayData */
  ArrayData.map((obj) => {
    //** send an object to the productCard for each occurance in the ArrayData */
    productCard(obj);
  });
};

//** render single deailcard by id */
const renderDetail = (id) => {
  //** filter ApiData by id */
  let card = ApiData.filter((items) => items.id === id);
  //** clear the DOM for new data */
  document.getElementById("root").innerHTML = "";

  //** run the function to add a single card */
  productCard(...card);
};

//** render a product card */
const productCard = (obj) => {
  //** destructure the data from the incomming object */
  const { id, brand, category, description, discountPercentage, images, price, rating, stock, thumbnail, title } = obj;

  //** add a card to the innerHTML */
  document.getElementById("root").innerHTML += `<figure class="card" ><div>
  <img src=${thumbnail} alt=${title} onclick="renderDetail(${id})">

  <article class="container">  
  <p>${brand}</p>
  <h3> ${title} </h3>
  ${description}
  <aside>${price} kr.</aside>
  </article></div>
  </figure>`;
};

const uniqueBy = (str) => {
  /** unique by brand or category - unique means render ONLY one of each */
  const uniqueVal = [...new Set(ApiData.map((item) => item[str]))];

  /** clear the TempArr array making place for new contant */
  TempArr.length = 0;
  //** push new content to TempArr */
  TempArr.push(...uniqueVal);

  //** render all the buttons by calling this function */
  RenderShopButtons(str);
};

//** render a button for each brand or category in the api */
const RenderShopButtons = (str) => {
  let html = TempArr.map((string) => {
    return `<button onclick="filterProductCard('${string}', '${str}')">${string}</button>`;
  }).join(""); //**.join("") combine all rendered temperate literals strings to one string */
  //** add the value of the variable html to the DOM */
  document.getElementById("navbar").innerHTML = html;
};

//** used to filter the productcards by  */
const filterProductCard = (string, str) => {
  //** create a temperary array to hold pushed data */
  const filtredArr = [];

  //** push filtred data to the filtredArr */
  filtredArr.push(
    //** filter through the full ApiData array to get all values matching the filter*/
    ApiData.filter((obj) => {
      /**
       * return each object that match eg.
       * obj['brand'] === 'Apple'
       * obj['category'] === 'smartphone'
       */
      return obj[str] === string;
    })
  );
  //** render products with the spreaded filtredArr */
  renderProducts(...filtredArr);
};

//* initialise the page by calling the renderingProducts function
initPage();

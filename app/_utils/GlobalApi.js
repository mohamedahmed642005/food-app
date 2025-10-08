const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_URL
import { gql, GraphQLClient } from 'graphql-request'



const client = new GraphQLClient(MASTER_URL)

const getCategory=async ()=> {
const  query = gql`
  query MyQuery {
    categories(first: 20) {
      id
      name
      icon {
        url
      }
    }
  }
`
const result = await client.request(query)
return result
}

const getRestaurants = async(category)=>{
   let query;
   if (category && category !== "All"){

   
    query = gql`
 query MyQuery {
  restaurants(where: {category_some: {name: "${category}"}}) {
    aboutUs
    address
    banner {
      url
    }
    id
    name
    restuarantType
    slug
    workingHours
    category {
      name
    }
  }
}`
} else{
  query = gql`
 query MyQuery {
  restaurants {
    aboutUs
    address
    banner {
      url
    }
    id
    name
    restuarantType
    slug
    workingHours
    category {
      name
    }
  }
}`
}
const result = await client.request(query)
return result
}

const restaurantDetails= async(restaurantSlug)=>{
 const  query = gql`
 query RestaurantDetails {
  restaurant(where: {slug: "${restaurantSlug}"}) {
    address
    banner {
      url
    }
    id
    name
    slug
    workingHours
    restuarantType
    menu {
      ... on Menu {
        id
        category
        menuItem {
          ... on MenuItem {
            id
            name
            price
            description
            productImage {
             id
              url
            }
          }
        }
      }
    }
  }
}`
const result = await client.request(query)
return result

}

const AddToCart = async(data)=> {
const query = gql `
mutation AddToCart {
  createShoppingCart(
    data: {productName: "${data.productName}", price: ${data.price}, productDescription: "${data.productDescription}", email: "${data.email}", productImage: {connect: {id: "${data.productImageId}"}}}
  ) {
    id
  }
  publishManyShoppingCarts(to: PUBLISHED) {
    count
  } 
}

`
const result = await client.request(query)
return result
}

const getUserCart=async (userEmail)=> {
  const query = gql `
  query GetUserCart {
  shoppingCarts(where: {email: "${userEmail}"}) {
    id
    price
    productDescription
    productName
    productImage {
      id
      url
    }
  }
}
  `
  const result = await client.request(query)
return result
  
}

const DeleteFromCart  = async(id)=>{
  const query = gql`
  mutation MyMutation {
  deleteShoppingCart(where: {id: "${id}"}) {
    id
  }
}
  `
    const result = await client.request(query)
return result
}

const addNewReview=async (data)=>{
  const query = gql`
  mutation ReviewShow {
  createReview(
    data: {userEmail: "${data.userEmail}", userName: "${data.userName}", comment: "${data.comment}", rating: ${data.rating}, restaurant: {connect: {slug: "${data.restaurantSlug}"}}}
  ) {
    comment
    id
  }
     publishManyReviews(to: PUBLISHED) {
    count
  }
}
  `
   const result = await client.request(query)
return result
}

const getReviews=async (restaurantSlug)=>{
const query = gql`
query getReviews {
  reviews(where: {restaurant_some: {slug: "${restaurantSlug}"}}) {
    comment
    userEmail
    userName
    rating
    createdAt
  }
}

`
const result = await client.request(query)
return result
}

const createNewOrder = async (data) => {
  const orderItemsString = data.orderItems
    .map(item => `{ OrderItem: { name: "${item.name}", price: ${item.price} } }`)
    .join(",");
 
  const query= gql `

  mutation MyMutation {
  createOrder(
    data: {userName: "${data.userName}", email: "${data.email}", address: "${data.address}", phone: ${data.phone}, zip: ${data.zip}, orderAmount: ${data.orderAmount}, orderDetails: { create: [${orderItemsString}] } }
  ) {
    id
      userName
      orderAmount
      email
      address
      phone
      zip
      orderDetails {
        ... on OrderItem {
          name
          price
        }

        

      }
       createdAt
  }
         publishManyOrders(to: PUBLISHED) {
    count
  }
}
  `

  const result = await client.request(query)
return result.createOrder
}


const myOrders = async (email)=>{
  const query = gql`
  query MyOrders {
  orders(where: {email: "${email}"}) {
    address
    createdAt
    id
    orderAmount
    orderDetails {
      ... on OrderItem {
        id
        name
        price
      }
    }
    phone
    userName
  }
}
  `

    const result = await client.request(query)
return result
}

export default {
    getCategory,
    getRestaurants,
    restaurantDetails,
    AddToCart,
    getUserCart,
    DeleteFromCart,
    addNewReview,
    getReviews,
    createNewOrder,
    myOrders
    
}
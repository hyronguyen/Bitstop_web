const URL = 'http://localhost:8080'; 


// API LOGIN
async function apiLogin(user_name, user_password) {
  try {
    // thông tin đăng nhập
    const loginPayload = {
      user_name,
      user_password
    };

    // tạo yêu cầu post
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/auth/login`,
      data: loginPayload
    });

    // thành công
    if (response.status === 200) {
      const { token } = response.data; 
      console.log('Login successful!', token);

      // lưu vào local storage
      localStorage.setItem('authToken', token);

      return token;
    }
  } catch (error) {
    //  Báo lỗi
    if (error.response) {
      console.error('Login failed:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// API LẤY USERS THEO ID
async function apiGetUserByID(userId) {
  try {
    const authToken = localStorage.getItem('authToken');
    
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/users/get_byDocID/${userId}`,
      headers: {
        Authorization: `Bearer ${authToken}` 
      }
    });
    // Thành công
    if (response.status === 200) {
      const userData = response.data;  
      
      return userData;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//APi LẤY TẤT CẢ sản phẩm
async function apigetAllProducts() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_products`,
    });
    // Thành công
    if (response.status === 200) {
      const productsData = response.data;
      return productsData;
    }
  } catch (error) {
      console.error('Error:', error.message);
  }
}

//API LẤY PRODUCT THEO PLATFORM
async function apigetProductsByPlat(platform) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbyplat/${platform}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//API LẤY PRODUCT THEO CATEGORY
async function apigetProductsByCategory(category) {
  try{
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbycategory/${category}`, 
    });

    if (response.status === 200){
      const Data = response.data;  
      return Data;
    }
  }
  catch (error){
    console.error(error.message);
  }
  
}

//API SEARCH THEO KEYWORD
async function apigetProductsByKeyword(keyword) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbykey/${keyword}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Error:', error.message);

  }
}

//API SEARCH THEO ID
async function apigetProductsById(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/products/get_productbyid/${id}`,
    });
    
    if (response.status === 200) {
      const Data = response.data;  
      return Data;
    }
  } catch (error) {
      console.error('Lỗi: ', error.message);

  }
}


// API lấy order theo ID người dùng
async function apigetOrdersByCustomerId(customerId) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/orders/customer/${customerId}`,
    });
    
    if (response.status === 200) {
      const orders = response.data;
      return orders;
    }
  } catch (error) {
    console.error('Error fetching orders by customer ID: ', error.message);
  }
}

// lấy tất cả order
async function apigetAllOrders() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/orders/all`,
    });

    if (response.status === 200) {
      const orders = response.data;
      return orders;
    }
  } catch (error) {
    console.error('Error fetching all orders: ', error.message);
  }
}

// lấy order đang xử lý
async function apigetAllProcessingOrders() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/orders/status/processing`,
    });

    if (response.status === 200) {
      const orders = response.data;
      return orders;
    }
  } catch (error) {
    console.error('Error fetching processing orders: ', error.message);
  }
}

//lấy order đang giao
async function apigetAllDeliveringOrders() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/orders/status/delivering`,
    });

    if (response.status === 200) {
      const orders = response.data;
      return orders;
    }
  } catch (error) {
    console.error('Error fetching delivering orders: ', error.message);
  }
}


//lấy order đã thành công 
async function apigetAllSucceededOrders() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/orders/status/succeeded`,
    });

    if (response.status === 200) {
      const orders = response.data;
      return orders;
    }
  } catch (error) {
    console.error('Error fetching succeeded orders: ', error.message);
  }
}

// tạo đơn hàng
async function apiCreateOrder(orderData) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/orders/create_order`,  
      data: orderData, 
    });

    if (response.status === 201) {
      console.log('Order created successfully:', response.data);
      return response.data;  
    }
  } catch (error) {
    console.error('Error creating order: ', error.message);
  }
}

async function apiEditProfile(docID, profileData) {
  try {
    const response = await axios({
      method: 'PUT', // Use PUT for updates
      url: `${URL}/api/users/edit_profile/${docID}`, // Adjust the endpoint accordingly
      data: profileData, // The profile data to update
    });

    if (response) {
      return response; 
    }
    else {
      console.log("No Response");
    }

  } catch (error) {
    console.log('Thất bại');
  }
}

//Thêm sản phẩm
async function apiAddProduct(productdata) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${URL}/api/products/add_product`,  
      data: productdata, 
    });

    if (response.status === 201) {
      console.log('Product created successfully:', response.data);
      return response.data;  
    } 
  } catch (error) {
    console.error('Error creating order: ', error.message);
  }
}


//Lấy purchase
async function apiGetAllPurchase() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/purchase/get_allpurchase`,
    });

    if (response.status === 200) {
      const purchases = response.data;
      return purchases;
    }
  } catch (error) {
    console.error('Error fetching all orders: ', error.message);
  }
  
}

//Lấy sản phẩm trong kho--Việt
async function apiGetStorageItems() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/storage/get_storageItems`,
    });

    if (response.status === 200) {
      const purchases = response.data;
      return purchases;
    }
  } catch (error) {
    console.error('Error fetching all orders: ', error.message);
  }
  
}
//Lấy hóa đơn--Việt
// Lấy thông tin từ PURCHASE
async function apiGetPurchaseItems() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/storage/get_PurchaseItems`,  
    });

    if (response.status === 200) {
      const purchases = response.data;
      return purchases;
    }
  } catch (error) {
    console.error('Error fetching purchase items: ', error.message);
  }
}

// Cập nhật số lượng kho
async function apiUpdateProductQuantity(product) {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${URL}/api/storage/update_StorageQuantity`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        identify: product.identify,
        qa: product.qa,
      },
    });

    if (response.status === 200) {
      console.log('Product quantity updated in storage:', response.data);
    }
  } catch (error) {
    console.error('Error updating product quantity:', error.message);
  }
}


async function apiUpdatePurchaseStatus(purchaseId, status) {
  try {
      console.log('Sending purchase ID:', purchaseId); // Log giá trị gửi đi
      const response = await axios({
          method: 'PUT',
          url: `${URL}/api/storage/update_PurchaseStatus`,
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              purchaseId: purchaseId,
              status: status
          },
      });

      if (response.status === 200) {
          console.log('Purchase status updated successfully:', response.data);
      }
  } catch (error) {
      console.error('Error updating purchase status:', error.message);
  }
}


async function apiCreateSMInput(purchaseId, smItems, smDes) {
  try {
      const response = await axios({
          method: 'POST',
          url: `${URL}/api/storage/update_createSMInput`,
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              purchaseId: purchaseId,
              smItems: smItems,      // The list of items from the purchase
              smDes: 'Stock goods input'  // You can customize this description
          },
      });

      if (response.status === 201) {
          console.log('SM Input created successfully:', response.data);
      }
  } catch (error) {
      console.error('Error creating SM Input:', error.message);
  }
}
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
    if(error.status === 404){
      alert("No products of this platform");
    }
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
    if(error.status === 404){
      alert("No products of this category!");
    }
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
    console.error('Error creating order: ', error.response.data.message);
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

  } catch (error) {
    if (error.status === 400){
      alert(error.response.data.message);
    }
    if (error.status === 404){
      alert(error.response.data.message);
    }
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

//Trừ số lượng kho
async function apiSubstractProductQuantity(product) {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${URL}/api/storage/substract_StorageQuantity`,
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

// cập nhật trạng thái
async function apiUpdatePurchaseStatus(purchaseId) {
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
          },
      });

      if (response.status === 200) {
          console.log('Purchase status updated successfully:', response.data);
      }
  } catch (error) {
      console.error('Error updating purchase status:', error.message);
  }
}


async function apiCreateSMInput(purchaseId, smItems) {
  try {
      const response = await axios({
          method: 'POST',
          url: `${URL}/api/storage/update_createSMInput`,
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              purchaseId: purchaseId,
              smItems: smItems,    
          },
      });

      if (response.status === 201) {
          console.log('SM Input created successfully:', response.data);
      }
  } catch (error) {
      console.error('Error creating SM Input:', error.message);
  }
}

async function apiGetSMItems() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/sm/get_smItems`,  // Ensure the correct base URL is used
    });

    if (response.status === 200) {
      const smItems = response.data;
      return smItems;
    } else {
      console.error('Error fetching SM items: ', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching SM items: ', error.message);
  }
}


// Hàm API để cập nhật số lượng sản phẩm trong storage
async function apiUpdateStockQuantity(productId, newQuantity) {
  try {
      const response = await fetch('/api/storage/update_StorageQuantity', { 
          method: 'PUT', // PUT hoặc POST tùy thuộc vào yêu cầu API
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              productId: productId,
              newQuantity: newQuantity
          })
      });

      if (!response.ok) {
          throw new Error(`Failed to update stock for product ID: ${productId}`);
      }

      const data = await response.json(); // Giả định rằng API trả về JSON
      console.log('API Response:', data);
      return data; // Trả về dữ liệu từ API nếu cần
  } catch (error) {
      console.error(`Error in API call for product ID: ${productId}`, error);
      throw error; // Bắn lỗi lên để xử lý bên ngoài
  }
}



async function apiUpdateSMStatus(sm_id, sm_status) {
  try {
      const response = await axios({
          method: 'PUT',
          url: `${URL}/api/sm/update_SMStatus`, 
          headers: {
              'Content-Type': 'application/json',
          },
          data: {
              sm_id: sm_id,
              sm_status: sm_status,
          },
      });

      if (response.status === 200) {
          console.log('SM status updated successfully:', response.data);
      }
  } catch (error) {
      console.error('Error updating SM status:', error.message);
  }
}


async function apiGetDoneSMItems() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/api/sm/get_DoneSMItems`,  // Ensure the correct base URL is used
    });

    if (response.status === 200) {
      const smItems = response.data;
      return smItems;
    } else {
      console.error('Error fetching SM items: ', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching SM items: ', error.message);
  }
}


async function apiUpdateProductStockQuantity(productId, newQuantity) {
  try {
      const response = await axios.put('/api/storage/update_EditStockQuantity', {
          productId: productId,
          newQuantity: newQuantity
      });
      console.log('Updated product quantity:', response.data);
  } catch (error) {
      console.error('Error updating product quantity:', error);
  }
}


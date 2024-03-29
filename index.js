const express = require('express');
const cors = require('cors');
const app = express();
const sql = require('mysql');
const PORT = 3400;

app.use(cors());
app.use(express.json());
const myDb = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
})
function queryPromise(db, sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
}
  
app.get("/items", (req, res) => {
    const query = "SELECT * FROM sanpham WHERE MoiNhat = 1";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const query = "SELECT * FROM SanPham WHERE MaSP = ?";
    myDb.query(query, [itemId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

// Render flower items
app.get("/menu/flowers", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Hoa'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    }) 
})
// Render animal items
app.get("/menu/animals", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Con Giáp'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/bags", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Túi'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/coasters", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Lót Ly'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/bears", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Gấu'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/hats", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai ='Mũ'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/keychains", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Móc khóa'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
app.get("/menu/zodiacs", (req, res) => {
    const query = "SELECT * FROM SanPham WHERE Loai = 'Cung Hoàng Đạo'";
    myDb.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})
// Handle for  signup
app.post("/signup", async (req, res) => {
    const { email, pwd } = req.body;
    const checkEmailQuery = "SELECT * FROM KhachHang WHERE Email = ?";
    try {
      const results = await queryPromise(myDb, checkEmailQuery, [email]);
      if (results.length > 0) {
        return res.status(400).json({ message: "Email đã tồn tại." });
      } else {
        const insertQuery = "INSERT INTO KhachHang (HoTen, Email, pwd) VALUES ('Người dùng mới', ?, ?)";
        await queryPromise(myDb, insertQuery, [email, pwd]);
        return res.status(200).json({ message: "Đăng ký thành công!" });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu đăng ký:", error);
      return res.status(500).json({ message: "Lỗi khi xử lý yêu cầu đăng ký." });
    }
});
// API for get all products in database
app.get("/menu/all", (req, res) => {
    const getAllProductsQuery = "SELECT * FROM SanPham";
    myDb.query(getAllProductsQuery, (err, data) => {
        if (err) {
            return res.status(500),json({message: "Lỗi hệ thống"})
        }
        return res.status(200).json(data);
    })
})
// Handle for login
app.post("/login", async (req, res) => {
    const {email, pwd} = req.body;
    const checkUserQuery = "SELECT * FROM KhachHang WHERE Email = ? AND pwd = ?";
    try {
        const results = await queryPromise(myDb, checkUserQuery, [email, pwd])
        if (results.length > 0) {
            return res.status(200).json({message: "Đăng nhập thành công!"})
        } else {
            return res.status(400).json({message: "Sai tài khoản hoặc mật khẩu!"})
        }
    }
    catch (e) {
        console.error("Lỗi khi đăng nhập vào hệ thống: ", e);
        return res.status(500).json({message: "Lỗi khi xử lý yêu cầu!"})
    }
})
// Handle for comments to contact
app.post("/contact", async (req, res) => {
    const {fullName, email, comments} = req.body;
    const insertCommentsQuery = "INSERT INTO contact (fullName, email, comments) VALUES (?, ?, ?)";
    myDb.query(insertCommentsQuery, [fullName, email, comments], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    })
})
// Handle when submitting order button
app.post("/cart", async (req, res) => {
    const {email, idProduct, number} = req.body;
    const getIdOfCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    try {
        const result = await queryPromise(myDb, getIdOfCustomerQuery, [email]);
        if (result.length > 0) {
            const idCustomer = result[0].MaKH;
            const getCustomerDataInCart = "SELECT * FROM GioHang WHERE MaKhachHang = ?"
            const customerData = await queryPromise(myDb, getCustomerDataInCart, [idCustomer]);
            if (customerData.length > 0) {
                const getDataFromCartHasProductQuery = "SELECT * FROM GHBaoGomSP WHERE MaKhachhang = ? AND MaSanPham = ?";
                const cartHasProductResult = await queryPromise(myDb, getDataFromCartHasProductQuery, [idCustomer, idProduct]);
                if (cartHasProductResult.length > 0) {
                    const updateCartHasProductQuery = "UPDATE GHBaoGomSP SET SoLuong = SoLuong + ? WHERE MaKhachHang = ? AND MaSanPham = ?";
                    await myDb.query(updateCartHasProductQuery, [number, idCustomer, idProduct], (err, data) => {
                        if (err) {
                            return res.status(500).json({message: 'Hệ thống có vấn đề nên không thể cập nhật dữ liệu vào bảng giỏ hàng bao gồm sản phẩm'})
                        }
                        return res.status(200).json({message: `Bạn đã cập nhật thành công sản phẩm ${idProduct} vào bảng giỏ hàng có sản phẩm`})
                    })
                }
                else {
                    const insertCartHasProductQuery = "INSERT INTO GHBaoGomSP VALUES (?, ?, ?)";
                    await myDb.query(insertCartHasProductQuery, [idCustomer, idProduct, number], (err, data) => {
                        if (err) {
                            return res.status(500).json(err)
                        }
                        return res.status(200).json({message: "Bạn vừa thêm dữ liệu ứng với sản phẩm đã chọn vào giỏ hàng"})
                    })
                }
            }
            else { // Trong bảng giỏ hàng chưa có thông tin của khách hàng trên (chưa được khởi tạo hoặc đã bị xóa sau khi người dùng đó chuyển sang trang đơn hàng ứng với một giỏ hàng bất kì)
                const inserDataCustomerIntoCart = "INSERT INTO GioHang VALUES (?, ?)";
                await myDb.query(inserDataCustomerIntoCart, [idCustomer, 0], async (err, data) => {
                    if (err) {
                        console.log("Lỗi khi chèn vào bảng giỏ hàng")
                    }
                    console.log(`Đã chèn thành công thông tin thông tin của khách hàng ${idCustomer} vào giỏ hàng`);
                    const insertIntoCartHasProductQuery = "INSERT INTO GHBaoGomSP VALUES (?, ?, ?)";
                    await myDb.query(insertIntoCartHasProductQuery, [idCustomer, idProduct, number], (err, data) => {
                        if (err) {
                            return res.status(500).json(err)
                        }
                        return res.status(200).json({message: 'Bạn đã chèn thành công thông tin vào bảng giỏ hàng bao gồm sản phẩm'})
                    })
                })

            }
        }
        else {
            return req.status(400).json({message: `Không thể tìm thấy khách hàng với email ${email} trong hệ thống`})
        }
    }
    catch (e) {
        return res.status(500).json({'message': 'Lỗi trên server'})
    }
})
// Get number of products of a particular user
app.get("/cart/:email", async (req, res) => {
    const email = req.params.email;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const countProductQuery = "SELECT SUM(SoLuong) AS sumProduct FROM GHBaoGomSP WHERE MaKhachHang = ?"
        myDb.query(countProductQuery, [idCustomer], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(200).json(data);
        })
    }
    else {
        return res.status(500).json({error: "Không tồn tại người dùng với email như vậy trong hệ thống"})
    }
})
// Get list of products in cart
app.get("/cartProduct/:email", async (req, res) => {
    const email = req.params.email;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const getListProductQuery = "SELECT MaSP, TenSP, Anh, SoLuong, GiaGoc FROM (GHBaoGomSP INNER JOIN SanPham ON MaSanPham = MaSP) WHERE MaKhachHang = ?";
        myDb.query(getListProductQuery, [idCustomer], (err, data) => {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            return res.status(200).json(data);
        })
    }
    else {
        return res.status(500).json({error: "Không tồn tại người dùng với email như vậy trong hệ thống"})
    }
})
// Api for update number of Product
app.post("/cart/number", async (req, res) => {
    const {numberOfProduct, email, idProduct} = req.body;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const updateNumberQuery = "UPDATE GHBaoGomSP SET SoLuong = ? WHERE MaKhachHang = ? AND MaSanPham = ?";
        myDb.query(updateNumberQuery, [numberOfProduct, idCustomer, idProduct], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({err: "Message"})
            }
            return res.status(200).json(data);
        })
    }
    else {
        return res.status(500).json({error: "Không tồn tại người dùng với email như vậy trong hệ thống"})
    }
})
// Api for remove all items in cart
app.delete("/cart/remove/:email", async (req, res) => {
    const email = req.params.email;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const removeAllItemsQuery = "DELETE FROM GioHang WHERE MaKhachHang = ?";
        myDb.query(removeAllItemsQuery, [idCustomer], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({err: "Message"})
            }
            return res.status(200).json(data);
        })
    } 
    else {
        return res.status(500).json({error: "Không tồn tại người dùng với email như vậy trong hệ thống"})
    }
    
})
// Api for remove particular product in cart
app.delete("/cart/remove/:email/:id", async (req, res) => {
    const email = req.params.email;
    const idProduct = req.params.id;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const removeProductInCartHasProductQuery = "DELETE FROM GHBaoGomSP WHERE MaKhachHang = ? AND MaSanPham = ?";
        myDb.query(removeProductInCartHasProductQuery, [idCustomer, idProduct], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({err: "Message failed"})
            }
            return res.status(200).json(data);
        })
    }
    else {
        return res.status(400).json({err: "Không tìm thấy người dùng với email như vậy trong hệ thống"})
    }
    
})
// Api for login admin
app.post("/loginAdmin", async (req, res) => {
    const {email, pwd} = req.body;
    const checkAdminAccountQuery = "SELECT * FROM Quanly WHERE email = ? AND pwd = ?";
    try {
        const result = await queryPromise(myDb, checkAdminAccountQuery, [email, pwd]);
        if (result.length > 0) {
            console.log("Login admin succeeded");
            return res.status(200).json(result);
        }
        else {
            console.log("Not Found admin account");
            return res.status(404).json({message: "Not Found Admin Account"});
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({message: "Server broke"})
    }
})
// API for admin
// API for get total customer from database
app.get("/customers", async(req, res) => {
    const getTotalCustomersQuery = "SELECT COUNT(Email) as tongKhachHang FROM KhachHang";
    myDb.query(getTotalCustomersQuery, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Server failed"});
        }
        return res.status(200).json(data)
    })
})
// API for get total type of Product in database
app.get("/products", async(req, res) => {
    const getTotalProductsQuery = "SELECT COUNT(MaSP) as tongSanPham FROM SanPham";
    myDb.query(getTotalProductsQuery, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Lỗi hệ thống"});
        }
        return res.status(200).json(data)
    })
})
// API for get total feedbackes from customers in database
app.get("/feedbacks", async(req, res) => {
    const getTotalFeedbacksQuery = "SELECT COUNT(id) as totalFeedback FROM contact";
    myDb.query(getTotalFeedbacksQuery, (err, data) => {
        if (err) {
            return res.status(500).json({message: "Server failed"});
        }
        return res.status(200).json(data)
    })
})
// handle for delete product in admin role
app.delete("/products/:id", async(req, res) => {
    const productId = req.params.id;
    const deleteProductQuery = "DELETE FROM SanPham WHERE MaSP = ?";
    myDb.query(deleteProductQuery, [productId], (err, data) => {
        if (err) {
            return res.status(500).json({message: "Server failed"});
        }
        return res.status(200).json({message: "Successful Deletion"})
    })
})
// handle for update product in admin role
app.put("/products/:id", async (req, res) => {
    const productId = req.params.id;
    const { name, cost, size } = req.body;
    let updateProductQuery = "UPDATE SanPham SET ";
    let values = [];
    if (name) {
        updateProductQuery += "TenSP = ?, ";
        values.push(name);
    }
    if (cost) {
        updateProductQuery += "GiaGoc = ?, ";
        values.push(cost);
    }
    if (size) {
        updateProductQuery += "KichCo = ?, ";
        values.push(size)
    }
    updateProductQuery = updateProductQuery.replace(/,\s*$/, "");
    updateProductQuery += " WHERE MaSP = ?";
    values.push(productId);

    // Thực hiện truy vấn
    myDb.query(updateProductQuery, values, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Server failed" });
        }
        return res.status(200).json({ message: "Successful Update" });
    });
});
// API FOR OPERATIONS FOR ORDER
// api for create order from cart has product
app.post("/order", async (req, res) => {
    try {
        const { email } = req.body;
        const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
        const customerResult = await queryPromise(myDb, getIdCustomerQuery, [email]);

        if (customerResult.length === 0) {
            return res.status(400).json({ err: "Không tìm thấy người dùng với email này" });
        }

        const idCustomer = customerResult[0].MaKH;

        const insertIntoOrderQuery = "INSERT INTO DonHang (NgayTaoDonHang, MaKH, TrangThai) VALUES (CURDATE(), ?, 'Chưa Thanh Toán')";
        const orderInsertionResult = await queryPromise(myDb, insertIntoOrderQuery, [idCustomer]);

        if (!orderInsertionResult.insertId) {
            return res.status(400).json({ err: "Tạo đơn hàng thất bại" });
        }

        const idOrder = orderInsertionResult.insertId;

        const getProductListQuery = "SELECT MaSP, SoLuong, GiaGoc FROM GHBaoGomSP JOIN SanPham ON MaSanPham = MaSP WHERE MaKhachHang = ?";
        const productList = await queryPromise(myDb, getProductListQuery, [idCustomer]);

        const insertIntoDHCoSPQuery = "INSERT INTO DHCoSP (MaDonHang, MaSanPham, SoLuong, GiaBan) VALUES (?, ?, ?, ?)";
        const insertPromises = productList.map(async product => {
            const sellPrice = product.GiaGoc - Math.floor(2000 + Math.random() * 3000);
            const { MaSP, SoLuong } = product;
            await queryPromise(myDb, insertIntoDHCoSPQuery, [idOrder, MaSP, SoLuong, sellPrice]);
        });

        // Chờ tất cả các lệnh insert vào DHCoSP hoàn thành
        await Promise.all(insertPromises);

        const deleteFromCartQuery = "DELETE FROM GioHang WHERE MaKhachHang = ?";
        await queryPromise(myDb, deleteFromCartQuery, [idCustomer]);

        return res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ err: error.message || "Lỗi máy chủ nội bộ" });
    }
});


// api for get list of order for each user
app.get("/order/:email", async (req, res) => {
    const email = req.params.email;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?"
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const getOrderListQuery = "SELECT HoaDon.MaDonHang AS MaDH, GiaTriTong, GiaTriUuDai, NgayTaoDonHang, TrangThai FROM HoaDon JOIN DonHang ON HoaDon.MaDonHang = DonHang.MaDonHang WHERE MaKH = ?";
        await myDb.query(getOrderListQuery, [idCustomer], (err, data) => {
            if (err) {
                return res.status(500).json(err)
            }
            console.log(data);
            return res.json(data);
        })
    }
    else {
        return res.status(400).json({err: "Không tìm thấy người dùng với email như vậy trong hệ thống"})
    }
})
// api for get info of product in an order
app.get("/order/product/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    const getProductInfoFromOrderQuery = "SELECT * FROM DHCoSP JOIN SanPham ON MaSanPham = MaSP WHERE MaDonHang = ?";
    await myDb.query(getProductInfoFromOrderQuery, [idOrder], (err, data) => {
        if (err)  {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for get general info of an order as totalCost and voucherCost based on idOrder
app.get("/order/general/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    const getGeneralInforOrderQuery = "SELECT * FROM HoaDon WHERE MaDonHang = ?";
    await myDb.query(getGeneralInforOrderQuery, [idOrder], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for update number of product in order
app.put("/order/:idProduct/:idOrder", async (req, res) => {
    const idProduct = req.params.idProduct;
    const idOrder = req.params.idOrder;
    const {SoLuong} = req.body;
    const updateProductInOrderQuery = "UPDATE DHCoSP SET SoLuong = ? WHERE MaDonHang = ? AND MaSanPham = ?";
    await myDb.query(updateProductInOrderQuery, [SoLuong, idOrder, idProduct], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data)
    })
})
// api for delete product in order
app.delete("/order/:idProduct/:idOrder", async (req, res) => {
    const idProduct = req.params.idProduct;
    const idOrder = req.params.idOrder;
    const deleteProductInOrderQuery = "DELETE FROM DHCoSP WHERE MaSanPham = ? AND MaDonHang = ?";
    await myDb.query(deleteProductInOrderQuery, [idProduct, idOrder], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for delete order before confirm
app.delete("/order/:idOrder", async(req, res) => {
    const idOrder = req.params.idOrder;
    const deleteOrderQuery = "DELETE FROM DonHang WHERE MaDonHang = ?";
    await myDb.query(deleteOrderQuery, [idOrder], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for confirm order
app.post("/order/:idOrder/:couponCost", async (req, res) => {
    const idOrder = req.params.idOrder;
    const couponCost = req.params.couponCost;
    const updateCouponCostQuery = "UPDATE HoaDon SET GiaTriUuDai = ? WHERE MaDonhang = ?";
    try {  
        await myDb.query(updateCouponCostQuery, [couponCost, idOrder], async (err, data) => {
            if (err) {
                return res.json(err)
            }
            const confirmOrderQuery = "UPDATE DonHang SET TrangThai = 'Đã Thanh Toán' WHERE MaDonHang = ?";
            await myDb.query(confirmOrderQuery, [idOrder]);
            return res.json({ message: "Cập nhật thành công!" });
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
});
// api for get status of order
app.get("/order/status/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    const getStatusOrderQuery = "SELECT TrangThai FROM DonHang WHERE MaDonHang = ?";
    await myDb.query(getStatusOrderQuery, [idOrder], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data);
    })
})
// api for get all coupons in our system
app.get("/coupon", async (req, res) => {
    const getAllCouponsQuery = "SELECT * FROM UuDai LEFT JOIN UuDaiQuyDoi ON MaUuDai = MaUuDaiQuyDoi";
    await myDb.query(getAllCouponsQuery, (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for get coupon of an user
app.get("/coupon/user/:email", async (req, res) => {
    const email = req.params.email;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const getCustomerCouponQuery = "SELECT * FROM UuDai JOIN UDThuocKH ON UuDai.MaUuDai = UDThuocKH.MaUuDai WHERE UDThuocKH.MaKhachHang = ?";
        await myDb.query(getCustomerCouponQuery, [idCustomer], (err, data) => {
            if (err) {
                return res.json(err)
            }
            return res.json(data)
        })
    }
    else {
        return res.json({err: "Không tìm thấy người dùng với email như vậy trong hệ thống"})
    }
   
})
// api for post voucher information into an order
app.post("/coupon/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    const {idCoupon, number} = req.body;
    const insertCouponforOrderQuery = "INSERT INTO UDApDungDH VALUES (?, ?, ?)";
    await myDb.query(insertCouponforOrderQuery, [idCoupon, idOrder, number], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for get number of customer having coupon based on idVoucher
app.get("/coupon/number/:idCoupon", async (req, res) => {
    const idCoupon = req.params.idCoupon;
    const getNumberCustomerHavingCouponQuery = "SELECT COUNT(*) AS totalCustomer FROM UDThuocKH WHERE MaUuDai = ? AND SoLuong > 0";
    await myDb.query(getNumberCustomerHavingCouponQuery, [idCoupon], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for post coupon info into coupon table
app.post("/coupon/getCoupon/:idCoupon", async (req, res) => {
    const {email} = req.body;
    const idCoupon = req.params.idCoupon;
    const getIdCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    const result = await queryPromise(myDb, getIdCustomerQuery, [email]);
    if (result.length > 0) {
        const idCustomer = result[0].MaKH;
        const checkCouponOfCustomerQuery = "SELECT * FROM UDThuocKH WHERE MaUuDai = ? AND MaKhachHang = ?";
        const result1 = await queryPromise(myDb, checkCouponOfCustomerQuery, [idCoupon, idCustomer]);
        if (result1.length > 0) {
            const updateCouponOfCustomerQuery = "UPDATE UDThuocKH SET SoLuong = SoLuong + 1 WHERE MaUuDai = ? AND MaKhachHang = ?";
            await myDb.query(updateCouponOfCustomerQuery, [idCoupon, idCustomer], async (err, data) => {
                if (err) {
                    return res.json(err)
                }
                const updateCouponQuery = "UPDATE UuDai SET SoLuongConLai = SoLuongConLai - 1 WHERE MaUuDai = ?";
                await myDb.query(updateCouponQuery, [idCoupon], (err, data) => {
                    if(err) {
                        return res.json(err)
                    }
                    return res.json(data);
                })
            })
        }
        else {
            const insertIntoCouponOfCustomerQuery = "INSERT INTO UDThuocKH VALUES (?, ?, 1)";
            await myDb.query(insertIntoCouponOfCustomerQuery, [idCoupon, idCustomer], (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        })
        }
    }
    else {
        console.log("Không tồn tại khách hàng nào với email như thế trong hệ thống")
    }
})
// api for post coupon info in coupon cost 
app.post("/coupon/adopt/:idOrder/:idCoupon", async (req, res) => {
    const idOrder = req.params.idOrder;
    const idCoupon = req.params.idCoupon;
    const checkSameCouponForOrderQuery = "SELECT SoLuongSuDung FROM UDApDungDH WHERE MaUuDai = ? AND MaDonHang = ?";
    const result = await queryPromise(myDb, checkSameCouponForOrderQuery, [idCoupon, idOrder]);
    if (result.length > 0) {
        const number = result[0].SoLuongSuDung;
        const updateCouponForOrderQuery = "UPDATE UDApDungDH SET SoLuongSuDung = ? + 1 WHERE MaUuDai = ? AND MaDonHang = ?";
        await myDb.query(updateCouponForOrderQuery, [number, idCoupon, idOrder], (err, data) => {
            if (err) {  
                return res.json(err)
            }
            return res.json(data);
        })
    }
    else {
        const insertIntoCouponForOrderQuery = "INSERT INTO UDApDungDH VALUES (?, ?, 1)";
        await myDb.query(insertIntoCouponForOrderQuery, [idCoupon, idOrder], (err, data) => {
        if (err) {  
            return res.json(err)
        }
        return res.json(data);
    })
    }
})
// api for get Coupon cost of an order
app.get("/coupon/couponCost/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    const getCouponCostQuery = "SELECT GiaTriUuDai FROM HoaDon WHERE MaDonHang = ?";
    await myDb.query(getCouponCostQuery, [idOrder], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})
// api for get list of available coupon for order
app.get("/order/listCoupon/:idOrder", async (req, res) => {
    const idOrder = req.params.idOrder;
    myDb.query("CALL Lay_Uu_Dai_Cho_Don_Hang(?)", [idOrder], (error, results, fields) => {
        if (error) {
          console.error("Lỗi khi gọi thủ tục:", error);
          res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
        } else {
          res.json(results[0]); 
        }
      });
})
// api for get most product sold in mm/yy
app.get("/product/bestSeller/:type/:month/:year", async (req, res) => {
    const type = req.params.type;
    const month = req.params.month;
    const year = req.params.year;
    await myDb.query("CALL San_Pham_Ban_Chay_Nhat_Cua_Loai_Trong_Thang(?, ?, ?)", [type, month, year], (error, results) => {
        if (error) {
            console.error("Lỗi khi gọi thủ tục:", error);
            res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
          } else {
            res.json(results[0]); 
          }
    })
})
// api for post coupon into system
app.post("/adminCoupon/post", async (req, res) => {
    const {MaUuDai, GiaTri, SoTienToiThieuApDung, SoTienToiDaApDung, SoLuongToiDaApDung, SoLuongConLai, NgayApDung, NgayHetHan, KieuUuDai, DieuKienQuyDoi} = req.body;
    await myDb.query("CALL ThemUuDai(?, ?, ?, ?, ?, ? ,? ,? ,?, ?)", [MaUuDai, GiaTri, SoTienToiThieuApDung, SoTienToiDaApDung, SoLuongConLai, NgayApDung, NgayHetHan, SoLuongToiDaApDung, KieuUuDai, DieuKienQuyDoi], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data);
    })
})
// api for get list of coupon for type
app.get("/coupon/getType/:type", async (req, res) => {
    const type = req.params.type;
    if (type === "Tất cả") {
        await myDb.query("SELECT * FROM UuDai LEFT JOIN UuDaiQuyDoi ON MaUuDai = MaUuDaiQuyDoi", [], (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        })
    }
    else if (type === "Có sẵn") {
        await myDb.query("SELECT * FROM UuDai WHERE SoTienToiThieuApDung IS NOT NULL AND SoTienToiDaApDung IS NOT NULL", [], (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        })
    }
    else {
        await myDb.query("SELECT * FROM UuDai JOIN UuDaiQuyDoi ON MaUuDai = MaUuDaiQuyDoi WHERE LoaiQuyDoi = ?", [type], (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        })
    }

})
// api for delete coupon
app.delete("/coupon/delete1/:idCoupon", async (req, res) => {
    const idCoupon = req.params.idCoupon;
    await myDb.query("CALL XoaUuDai(?)", [idCoupon], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for update coupon
app.post("/coupon/update/:MaUuDai", async (req, res) => {
    const {GiaTriCapNhat, SoTienToiThieuApDungCapNhat, SoTienToiDaApDungCapNhat, SoLuongConLaiCapNhat, NgayApDungCapNhat, NgayHetHanCapNhat, SoLuongToiDaApDungCapNhat} = req.body;
    const MaUuDai = req.params.MaUuDai;
    await myDb.query("CALL CapNhatUuDai(?, ?, ?, ?, ?, ?, ?, ?)", [MaUuDai, GiaTriCapNhat, SoTienToiThieuApDungCapNhat, SoTienToiDaApDungCapNhat, SoLuongConLaiCapNhat, NgayApDungCapNhat, NgayHetHanCapNhat, SoLuongToiDaApDungCapNhat], (err, data) => {
        if (err) {return res.json(err)}
        return res.json(data)
    })
})
// api for give bestseller for product
app.post("/product/giveBestller/:idProduct/:month", async (req, res) => {
    const idProduct = req.params.idProduct;
    const month = req.params.month;
    const giveBestllerQuery = "UPDATE SanPham SET TenSP = CONCAT(TenSP, ' - Best seller tháng ', ?) WHERE MaSP = ?";
    myDb.query(giveBestllerQuery, [month, idProduct], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })
})
// api for delete a coupon of one user 
app.delete("/coupon/user/:idCoupon/:userEmail", async (req, res) => {
    const idCoupon = req.params.idCoupon;
    const userEmail = req.params.userEmail;
    const getIdOfCustomerQuery = "SELECT MaKH FROM KhachHang WHERE Email = ?";
    try {
        const result = await queryPromise(myDb, getIdOfCustomerQuery, [userEmail]);
        if (result.length > 0) {
            const idCustomer = result[0].MaKH;
            await myDb.query("DELETE FROM UDThuocKH WHERE MaUuDai = ? AND MaKhachHang = ?", [idCoupon, idCustomer], (err, data) => {
                if (err) {
                    return res.json(err)
                }
                return res.json(data)
            })
        }
        else {
            return res.json({err: "Không có người dùng với email như vậy"})
        }
    }
    catch(e) {
        console.error(e)
    }
})
app.listen(PORT, () => {
    console.log('Project is running')
})


module.export = app;
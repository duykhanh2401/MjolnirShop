# Website Thương mại điện tử

## Website sử dụng JavaScript + JWT + ExpressJS + Server render

> - Đăng nhập, đăng ký bằng Email.
> - Cập nhật thông tin người dùng.
> - Đặt hàng, thêm sản phẩm vào giỏ hàng, check số lượng khi thêm vào giỏ hàng.
> - Phân loại theo tên tác giả, danh mục.
> - Tìm kiếm theo tên sản phẩm.
> - Đánh giá sản phẩm sau khi admin xác nhận đã nhận hàng.
> - Admin Dashboard(Thêm,sửa,xoá sản phẩm, danh mục, tác giả)
> - Cập nhật trạng thái đơn hàng.
> - Quản lý người dùng.
> - Phân quyền người dùng và admin

## Demo http://store.duykhanhdev.codes/

## Tác giả: Vũ Duy Khánh

## Cách cài đặt dự án ở local

```
yarn
```

## Kết nối với mongodb và tạo file config.env

### config.env

> - PORT: Lựa chọn PORT của server
> - DATABASE: Link kết nối mongodb online
> - DATABASE_LOCAL=mongodb://localhost:27017/:database : Kết nối database ở local
> - JWT_SECRET: Dãy mã hoá JWT (Dãy ký tự ngẫu nhiên)
> - JWT_EXPIRES_IN : Thời gian tồn tại của JWT
> - JWT_COOKIE_EXPIRES_IN: Thời gian tồn tại của cookie

## Chạy sever Express

```
yarn start
```

## Một số hình ảnh của website

Giao diện người dùng
![](https://res.cloudinary.com/duykhanh2401/image/upload/v1651567390/Blog/Screenshot_2022-05-03_154257_bvtoyr.png)

Giao diện quản trị viên
![](https://res.cloudinary.com/duykhanh2401/image/upload/v1651567516/Blog/Screenshot_2022-05-03_154509_gvbejy.png)

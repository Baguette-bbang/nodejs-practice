// 주문하기
// 배송 정보 입력
INSERT INTO deliveries (address, receiver, contact) VALUES (?, ?, ?)

// 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES ("To Kill a Mockingbird", 3, 60000, 1, 1)

// 주문 상세 목록 입력
INSERT INTO orderedBooks (order_id, book_id, quantity)
VALUES (1, 1, 1)

INSERT INTO orderedBooks (order_id, book_id, quantity)
VALUES (1, 3, 2)
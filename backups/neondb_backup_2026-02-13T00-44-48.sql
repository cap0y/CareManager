-- ============================================
-- CareManager Platform DB Backup
-- 생성일시: 2026. 2. 13. 오전 9:44:35
-- ============================================

-- ============================================
-- 테이블 구조 (DDL)
-- ============================================

-- 테이블: addresses
DROP TABLE IF EXISTS "addresses" CASCADE;
CREATE TABLE "addresses" (
  "id" serial,
  "user_id" integer,
  "name" varchar(100) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "zipcode" varchar(10) NOT NULL,
  "address1" varchar(255) NOT NULL,
  "address2" varchar(255),
  "is_default" boolean DEFAULT false,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: admin_notifications
DROP TABLE IF EXISTS "admin_notifications" CASCADE;
CREATE TABLE "admin_notifications" (
  "id" serial,
  "type" varchar(50) NOT NULL,
  "message" text NOT NULL,
  "order_id" varchar(255),
  "reference_id" varchar(255),
  "is_read" boolean DEFAULT false,
  "status" varchar(50) DEFAULT 'unread'::character varying,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: bookings
DROP TABLE IF EXISTS "bookings" CASCADE;
CREATE TABLE "bookings" (
  "id" serial,
  "user_id" integer NOT NULL,
  "care_manager_id" integer NOT NULL,
  "service_id" integer NOT NULL,
  "date" timestamp NOT NULL,
  "duration" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "total_amount" integer NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now()
);

-- 테이블: care_managers
DROP TABLE IF EXISTS "care_managers" CASCADE;
CREATE TABLE "care_managers" (
  "id" serial,
  "name" text NOT NULL,
  "age" integer NOT NULL,
  "rating" integer NOT NULL,
  "reviews" integer NOT NULL DEFAULT 0,
  "experience" text NOT NULL,
  "location" text NOT NULL,
  "hourly_rate" integer NOT NULL,
  "services" jsonb NOT NULL,
  "certified" boolean NOT NULL DEFAULT false,
  "image_url" text,
  "description" text,
  "created_at" timestamp DEFAULT now(),
  "is_approved" boolean DEFAULT true,
  "intro_contents" jsonb
);

-- 테이블: cart_items
DROP TABLE IF EXISTS "cart_items" CASCADE;
CREATE TABLE "cart_items" (
  "id" serial,
  "user_id" integer,
  "product_id" integer,
  "quantity" integer NOT NULL DEFAULT 1,
  "selected_options" jsonb,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: favorites
DROP TABLE IF EXISTS "favorites" CASCADE;
CREATE TABLE "favorites" (
  "id" serial,
  "user_id" varchar(255) NOT NULL,
  "care_manager_id" integer NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: inquiries
DROP TABLE IF EXISTS "inquiries" CASCADE;
CREATE TABLE "inquiries" (
  "id" serial,
  "user_id" varchar(255) NOT NULL,
  "subject" varchar(500) NOT NULL,
  "category" varchar(50) NOT NULL,
  "message" text NOT NULL,
  "urgency" varchar(20) DEFAULT 'normal'::character varying,
  "status" varchar(20) DEFAULT 'pending'::character varying,
  "answer" text,
  "answered_by" varchar(255),
  "answered_at" timestamp,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: messages
DROP TABLE IF EXISTS "messages" CASCADE;
CREATE TABLE "messages" (
  "id" serial,
  "sender_id" integer NOT NULL,
  "receiver_id" integer NOT NULL,
  "content" text NOT NULL,
  "timestamp" timestamp DEFAULT now(),
  "is_read" boolean NOT NULL DEFAULT false
);

-- 테이블: notices
DROP TABLE IF EXISTS "notices" CASCADE;
CREATE TABLE "notices" (
  "id" serial,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "date" text NOT NULL,
  "is_important" boolean DEFAULT false,
  "category" text DEFAULT 'notice'::text
);

-- 테이블: notifications
DROP TABLE IF EXISTS "notifications" CASCADE;
CREATE TABLE "notifications" (
  "id" varchar(50) NOT NULL,
  "type" varchar(20) NOT NULL,
  "message" text NOT NULL,
  "order_id" varchar(50),
  "product_id" varchar(50),
  "reference_id" varchar(50),
  "is_read" boolean DEFAULT false,
  "seller_id" varchar(50),
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: order_items
DROP TABLE IF EXISTS "order_items" CASCADE;
CREATE TABLE "order_items" (
  "id" serial,
  "order_id" integer,
  "product_id" integer,
  "quantity" integer NOT NULL,
  "price" numeric(12, 2) NOT NULL,
  "total_price" numeric(12, 2) NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: orders
DROP TABLE IF EXISTS "orders" CASCADE;
CREATE TABLE "orders" (
  "id" serial,
  "user_id" integer,
  "total_amount" numeric(12, 2) NOT NULL,
  "shipping_address_id" integer,
  "payment_method" varchar(50) NOT NULL,
  "payment_status" varchar(20) DEFAULT 'pending'::character varying,
  "order_status" varchar(20) DEFAULT 'pending'::character varying,
  "tracking_number" varchar(100),
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: product_categories
DROP TABLE IF EXISTS "product_categories" CASCADE;
CREATE TABLE "product_categories" (
  "id" serial,
  "name" varchar(100) NOT NULL,
  "description" text,
  "parent_id" integer,
  "image_url" varchar(500),
  "is_active" boolean DEFAULT true,
  "category_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: product_comments
DROP TABLE IF EXISTS "product_comments" CASCADE;
CREATE TABLE "product_comments" (
  "id" serial,
  "user_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "content" text NOT NULL,
  "is_private" boolean DEFAULT false,
  "status" varchar(20) DEFAULT 'active'::character varying,
  "parent_id" integer,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: product_reviews
DROP TABLE IF EXISTS "product_reviews" CASCADE;
CREATE TABLE "product_reviews" (
  "id" serial,
  "user_id" integer NOT NULL,
  "product_id" integer NOT NULL,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "images" jsonb,
  "is_verified_purchase" boolean DEFAULT false,
  "status" varchar(20) DEFAULT 'active'::character varying,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: products
DROP TABLE IF EXISTS "products" CASCADE;
CREATE TABLE "products" (
  "id" serial,
  "seller_id" integer,
  "category_id" integer,
  "title" varchar(255) NOT NULL,
  "description" text,
  "price" numeric(12, 2) NOT NULL,
  "discount_price" numeric(12, 2),
  "stock" integer NOT NULL DEFAULT 0,
  "images" jsonb,
  "tags" jsonb,
  "status" varchar(20) DEFAULT 'active'::character varying,
  "rating" numeric(3, 2),
  "review_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: services
DROP TABLE IF EXISTS "services" CASCADE;
CREATE TABLE "services" (
  "id" serial,
  "name" text NOT NULL,
  "icon" text NOT NULL,
  "color" text NOT NULL,
  "description" text,
  "average_duration" text
);

-- 테이블: shipping_notifications
DROP TABLE IF EXISTS "shipping_notifications" CASCADE;
CREATE TABLE "shipping_notifications" (
  "id" serial,
  "order_id" integer,
  "message" text NOT NULL,
  "status" varchar(10) DEFAULT 'unread'::character varying,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: user_notification_settings
DROP TABLE IF EXISTS "user_notification_settings" CASCADE;
CREATE TABLE "user_notification_settings" (
  "id" serial,
  "user_id" varchar(255) NOT NULL,
  "push_notifications" boolean DEFAULT true,
  "email_notifications" boolean DEFAULT true,
  "sms_notifications" boolean DEFAULT false,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: user_privacy_settings
DROP TABLE IF EXISTS "user_privacy_settings" CASCADE;
CREATE TABLE "user_privacy_settings" (
  "id" serial,
  "user_id" varchar(255) NOT NULL,
  "profile_visible" boolean DEFAULT true,
  "show_location" boolean DEFAULT true,
  "allow_data_collection" boolean DEFAULT false,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 테이블: users
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
  "id" serial,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "name" text NOT NULL,
  "phone" text,
  "created_at" timestamp DEFAULT now(),
  "user_type" varchar(20) DEFAULT 'customer'::character varying,
  "grade" varchar(20) DEFAULT 'bronze'::character varying,
  "is_approved" boolean DEFAULT false,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "is_certified" boolean DEFAULT false,
  "certification_date" timestamp,
  "certification_type" varchar(50),
  "certification_payment_id" varchar(100)
);

-- ============================================
-- 제약조건 (PRIMARY KEY, UNIQUE)
-- ============================================

ALTER TABLE "addresses" ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id");
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");
ALTER TABLE "care_managers" ADD CONSTRAINT "care_managers_pkey" PRIMARY KEY ("id");
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
ALTER TABLE "notices" ADD CONSTRAINT "notices_pkey" PRIMARY KEY ("id");
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");
ALTER TABLE "orders" ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id");
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_pkey" PRIMARY KEY ("id");
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id");
ALTER TABLE "products" ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");
ALTER TABLE "services" ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");
ALTER TABLE "shipping_notifications" ADD CONSTRAINT "shipping_notifications_pkey" PRIMARY KEY ("id");
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_pkey" PRIMARY KEY ("id");
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_user_id_key" UNIQUE ("user_id");
ALTER TABLE "user_privacy_settings" ADD CONSTRAINT "user_privacy_settings_pkey" PRIMARY KEY ("id");
ALTER TABLE "user_privacy_settings" ADD CONSTRAINT "user_privacy_settings_user_id_key" UNIQUE ("user_id");
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ============================================
-- 데이터 (INSERT INTO)
-- ============================================

-- addresses: 데이터 없음

-- admin_notifications: 데이터 없음

-- bookings: 8건
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (12, 1, 3, 2, '2025-07-19T17:00:00.000Z', 2, 'pending', 44000, '2025-07-20 11:0에 예약', '2025-07-19T19:10:35.520Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (13, 3, 1, 1, '2025-07-20T15:00:00.000Z', 2, 'pending', 50000, '2025-07-21 9:0에 예약', '2025-07-19T23:17:15.124Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (14, 4, 2, 1, '2025-07-29T15:00:00.000Z', 2, 'confirmed', 46000, '2025-07-30 9:0에 예약', '2025-07-30T04:34:21.481Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (15, 4, 4, 1, '2025-07-30T15:00:00.000Z', 2, 'completed', 0, '2025-07-31 9:0에 예약', '2025-07-30T04:34:57.037Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (16, 4, 4, 1, '2025-07-29T17:00:00.000Z', 2, 'completed', 0, '2025-07-30 11:0에 예약', '2025-07-30T04:41:33.158Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (17, 4, 4, 1, '2025-07-30T19:00:00.000Z', 2, 'confirmed', 0, '2025-07-31 13:0에 예약', '2025-07-30T05:37:26.531Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (18, 4, 4, 1, '2025-07-29T21:00:00.000Z', 2, 'pending', 0, '2025-07-30 15:0에 예약', '2025-07-30T05:38:57.976Z');
INSERT INTO "bookings" ("id", "user_id", "care_manager_id", "service_id", "date", "duration", "status", "total_amount", "notes", "created_at") VALUES (19, 3, 2, 1, '2025-10-09T17:00:00.000Z', 2, 'pending', 46000, '2025-10-10 11:0에 예약', '2025-10-09T16:20:59.379Z');

-- care_managers: 5건
INSERT INTO "care_managers" ("id", "name", "age", "rating", "reviews", "experience", "location", "hourly_rate", "services", "certified", "image_url", "description", "created_at", "is_approved", "intro_contents") VALUES (1, '김미영', 45, 49, 127, '15년 경력의 베테랑 케어매니저', '서울 강남구', 25000, '["병원 동행","장보기"]', TRUE, '/images/profile/2.png', '오랜 경험을 바탕으로 세심한 케어를 제공합니다.', '2025-07-19T00:06:13.194Z', TRUE, NULL);
INSERT INTO "care_managers" ("id", "name", "age", "rating", "reviews", "experience", "location", "hourly_rate", "services", "certified", "image_url", "description", "created_at", "is_approved", "intro_contents") VALUES (2, '박수정', 38, 47, 89, '10년 경력, 의료진과의 소통 전문', '서울 서초구', 23000, '["병원 동행","말벗"]', TRUE, '/images/profile/3.png', '환자분들과의 따뜻한 소통을 중시합니다.', '2025-07-19T00:06:13.194Z', TRUE, NULL);
INSERT INTO "care_managers" ("id", "name", "age", "rating", "reviews", "experience", "location", "hourly_rate", "services", "certified", "image_url", "description", "created_at", "is_approved", "intro_contents") VALUES (3, '이순희', 52, 48, 156, '20년 경력의 가사 전문 케어매니저', '서울 송파구', 22000, '["가사 도움","장보기"]', TRUE, '/images/profile/image-1753831236077-568611436.png', '깨끗하고 체계적인 가사 관리를 도와드립니다.', '2025-07-19T00:06:13.194Z', TRUE, NULL);
INSERT INTO "care_managers" ("id", "name", "age", "rating", "reviews", "experience", "location", "hourly_rate", "services", "certified", "image_url", "description", "created_at", "is_approved", "intro_contents") VALUES (4, '진우', 43, 46, 73, '진우
', '서울 금천구', 0, '[{"name":"병원동행","price":0},{"name":"가사도우미","price":0},{"name":"말벗","price":0}]', TRUE, '/images/profile/image-1757046611415-658074474.png', '사)한국차양산업협회는 
공동구매, 공동마케팅, 공동
(사)한국차양산업협회는 
공동구매, 공동마케팅, 공동연구를 통해
회원들의 권익보호와 에너지 절약에 
앞장서겠습니다.', '2025-07-19T00:06:13.194Z', TRUE, '[{"id":"1nt9ufu4g","link":"http://www.kssia.or.kr/","type":"link","content":"한국차양산업협회","description":"한국차양산업협회"},{"id":"mi1qb062q","type":"youtube","content":"https://youtu.be/j7hCcJa_XGc"},{"id":"ewj6l0pr5","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=17912","type":"image","content":"/images/profile/image-1753803972134-578792968.png"},{"id":"470rk9crp","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=14640","type":"image","content":"/images/profile/image-1753804050852-662370414.png"},{"id":"j9x5i3c4u","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=9372","type":"image","content":"/images/profile/image-1753804069132-58051014.png"},{"id":"bn5fws49z","link":"http://www.pinksom.shop/","type":"image","content":"/images/profile/image-1753804097377-854265249.png"},{"id":"b30lmuliq","link":"http://www.kfsesb.or.kr/","type":"image","content":"/images/profile/image-1753804118087-339023719.png"},{"id":"vo37wcxr6","type":"image","content":"/images/profile/image-1753804139854-840946955.png"},{"id":"iuhaa64s7","type":"image","content":"/images/profile/image-1753804182685-486733481.png"},{"id":"2arugjb6k","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=19203","type":"image","content":"/images/profile/image-1753804204433-678540366.png"},{"id":"edjvb3e79","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=19056","type":"image","content":"/images/profile/image-1753804246284-479849419.jpg"},{"id":"hx0cmwfc5","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=19054","type":"image","content":"/images/profile/image-1753804265299-923416284.png"},{"id":"4x1c863xb","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=19059","type":"image","content":"/images/profile/image-1753804284844-14274667.png"},{"id":"htzgu3020","type":"youtube","content":"https://youtu.be/VrO7HeAzDxc","description":"소공인특화지원센터"},{"id":"lgatnb57i","type":"youtube","content":"https://youtu.be/3jbE8Inapvk","description":"한차협히스토리"},{"id":"skjga5lm0","link":"https://e-name.kr/bbs/board.php?bo_table=profile&wr_id=29713&is_proccess=change_style&wr_style=style99","type":"image","content":"/images/profile/image-1753804361903-763684770.jpg"}]');
INSERT INTO "care_managers" ("id", "name", "age", "rating", "reviews", "experience", "location", "hourly_rate", "services", "certified", "image_url", "description", "created_at", "is_approved", "intro_contents") VALUES (5, '한소영', 29, 45, 42, '3년 경력의 젊은 케어매니저', '서울 용산구', 20000, '["말벗","가사 도움"]', FALSE, '/images/profile/4.png', '활발하고 밝은 성격으로 즐거운 시간을 만들어드립니다.', '2025-07-19T00:06:13.194Z', TRUE, NULL);

-- cart_items: 3건
INSERT INTO "cart_items" ("id", "user_id", "product_id", "quantity", "selected_options", "created_at", "updated_at") VALUES (1, 3, 15, 1, NULL, '2025-08-12T11:54:22.636Z', '2025-08-12T11:54:22.636Z');
INSERT INTO "cart_items" ("id", "user_id", "product_id", "quantity", "selected_options", "created_at", "updated_at") VALUES (3, 4, 11, 1, NULL, '2025-08-12T12:00:20.129Z', '2025-08-12T12:00:20.129Z');
INSERT INTO "cart_items" ("id", "user_id", "product_id", "quantity", "selected_options", "created_at", "updated_at") VALUES (5, 4, 15, 1, NULL, '2025-08-12T12:12:31.120Z', '2025-08-12T12:12:31.120Z');

-- favorites: 3건
INSERT INTO "favorites" ("id", "user_id", "care_manager_id", "created_at") VALUES (1, '4', 3, '2025-08-12T03:45:18.992Z');
INSERT INTO "favorites" ("id", "user_id", "care_manager_id", "created_at") VALUES (2, '3', 3, '2025-08-12T03:45:45.408Z');
INSERT INTO "favorites" ("id", "user_id", "care_manager_id", "created_at") VALUES (3, '3', 2, '2025-08-12T03:45:47.860Z');

-- inquiries: 데이터 없음

-- messages: 데이터 없음

-- notices: 1건
INSERT INTO "notices" ("id", "title", "content", "date", "is_important", "category") VALUES (1, '안녕하세요.', '반가워요', '2025-07-22', FALSE, 'notice');

-- notifications: 데이터 없음

-- order_items: 데이터 없음

-- orders: 데이터 없음

-- product_categories: 15건
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (1, '전체', '모든 카테고리', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (2, '가공식품', '가공된 식품류', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (3, '건강식품', '건강 관련 식품 및 보조제', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (4, '기타', '기타 상품', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (5, '농산물', '신선한 농산물', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (6, '디지털상품', '디지털 콘텐츠 및 소프트웨어', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (7, '생활용품', '일상생활에 필요한 용품', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (8, '수산물', '신선한 수산물', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (9, '전자제품', '전자기기 및 가전제품', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (10, '주류', '알코올 음료', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (11, '축산물', '육류 및 축산 가공품', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (12, '취미/게임', '취미용품 및 게임', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (13, '카페/베이커리', '커피, 빵, 디저트', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (14, '패션', '의류 및 패션 액세서리', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');
INSERT INTO "product_categories" ("id", "name", "description", "parent_id", "image_url", "is_active", "category_order", "created_at", "updated_at") VALUES (15, '하드웨어', '하드웨어 및 도구', NULL, NULL, TRUE, 0, '2025-07-28T08:46:40.723Z', '2025-07-28T08:46:40.723Z');

-- product_comments: 1건
INSERT INTO "product_comments" ("id", "user_id", "product_id", "content", "is_private", "status", "parent_id", "is_admin", "created_at", "updated_at") VALUES (1, 3, 12, '안녕하세요', FALSE, 'active', NULL, FALSE, '2025-07-29T02:30:14.207Z', '2025-07-29T02:30:14.207Z');

-- product_reviews: 데이터 없음

-- products: 4건
INSERT INTO "products" ("id", "seller_id", "category_id", "title", "description", "price", "discount_price", "stock", "images", "tags", "status", "rating", "review_count", "created_at", "updated_at") VALUES (11, 4, 9, '유기농 감자', '무농약으로 재배한 신선한 유기농 감자입니다.', '8000.00', NULL, 30, '["/images/item/image-1753795657383-393131731.jpg"]', '["유기농","배추","농산물"]', 'active', '4.30', 15, '2025-07-28T04:07:37.018Z', '2025-07-29T13:39:24.577Z');
INSERT INTO "products" ("id", "seller_id", "category_id", "title", "description", "price", "discount_price", "stock", "images", "tags", "status", "rating", "review_count", "created_at", "updated_at") VALUES (12, 1, NULL, '프리미엄 김치', '전통 방식으로 만든 프리미엄 김치입니다.', '15000.00', '12000.00', 50, '["https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=300"]', '["김치","발효식품","한식"]', 'active', '4.50', 23, '2025-07-28T04:07:37.018Z', '2025-07-28T04:07:37.018Z');
INSERT INTO "products" ("id", "seller_id", "category_id", "title", "description", "price", "discount_price", "stock", "images", "tags", "status", "rating", "review_count", "created_at", "updated_at") VALUES (14, 1, NULL, '천연 꿀', '100% 천연 국산꿀로 건강에 좋습니다.', '25000.00', '20000.00', 15, '["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300"]', '["꿀","천연","건강식품"]', 'active', '4.80', 32, '2025-07-28T04:07:37.018Z', '2025-07-28T04:07:37.018Z');
INSERT INTO "products" ("id", "seller_id", "category_id", "title", "description", "price", "discount_price", "stock", "images", "tags", "status", "rating", "review_count", "created_at", "updated_at") VALUES (15, 5, 5, '지넷시스템 Z7 블랙박스 전후방 FHD/HD 2채널 32GB', '
<img src="/images/image-1753697438999-212672729.jpg" alt="상품설명이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />
<img src="/images/image-1753697450840-109986804.jpg" alt="상품설명이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />
<img src="/images/image-1753697463776-342028438.jpg" alt="상품설명이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />
', '50000.00', '40000.00', 99, '["/images/item/image-1753793628387-623078268.jpg"]', NULL, 'active', NULL, 0, '2025-07-28T08:10:03.975Z', '2025-07-29T12:54:10.551Z');

-- services: 4건
INSERT INTO "services" ("id", "name", "icon", "color", "description", "average_duration") VALUES (1, '병원 동행', 'fas fa-hospital', 'bg-gradient-to-br from-blue-500 to-cyan-500', '의료진과의 소통을 도와드리고 안전한 병원 방문을 지원합니다', '평균 3-4시간 소요');
INSERT INTO "services" ("id", "name", "icon", "color", "description", "average_duration") VALUES (2, '장보기', 'fas fa-shopping-cart', 'bg-gradient-to-br from-green-500 to-teal-500', '신선한 식재료와 생필품을 대신 구매해드립니다', '평균 2-3시간 소요');
INSERT INTO "services" ("id", "name", "icon", "color", "description", "average_duration") VALUES (3, '가사 도움', 'fas fa-home', 'bg-gradient-to-br from-purple-500 to-pink-500', '청소, 세탁, 정리정돈 등 집안일을 도와드립니다', '평균 4-5시간 소요');
INSERT INTO "services" ("id", "name", "icon", "color", "description", "average_duration") VALUES (4, '말벗', 'fas fa-comments', 'bg-gradient-to-br from-orange-500 to-red-500', '따뜻한 대화와 정서적 지원을 제공합니다', '평균 2-3시간 소요');

-- shipping_notifications: 데이터 없음

-- user_notification_settings: 데이터 없음

-- user_privacy_settings: 데이터 없음

-- users: 4건
INSERT INTO "users" ("id", "email", "password", "name", "phone", "created_at", "user_type", "grade", "is_approved", "updated_at", "is_certified", "certification_date", "certification_type", "certification_payment_id") VALUES (1, 'admin@shop.com', '$2b$10$placeholder', '관리자', NULL, '2025-07-27T19:07:36.822Z', 'admin', 'gold', TRUE, '2025-07-27T19:07:36.822Z', FALSE, NULL, NULL, NULL);
INSERT INTO "users" ("id", "email", "password", "name", "phone", "created_at", "user_type", "grade", "is_approved", "updated_at", "is_certified", "certification_date", "certification_type", "certification_payment_id") VALUES (3, 'decom@gmail.com', '$2b$10$szmZQ8By7QazpFyytAUXrOtmNcrSjJxVM/c8FDQUa/mdsZxhoUUqe', '김영철', '0104848887', '2025-07-19T23:39:07.384Z', 'customer', 'bronze', FALSE, '2025-07-19T23:39:07.384Z', FALSE, NULL, NULL, NULL);
INSERT INTO "users" ("id", "email", "password", "name", "phone", "created_at", "user_type", "grade", "is_approved", "updated_at", "is_certified", "certification_date", "certification_type", "certification_payment_id") VALUES (4, 'decom2@gmail.com', '$2a$10$ahjmRtkzrTW5Lvyh9D6LteJRHmJFVODTeBaWievK4mSWINV5l5vNK', '권오금', '0104848887', '2025-07-19T23:39:31.731Z', 'careManager', 'bronze', FALSE, '2025-07-19T23:39:31.731Z', TRUE, '2025-07-29T21:01:36.123Z', 'care_manager_certification', 'manual-admin-update');
INSERT INTO "users" ("id", "email", "password", "name", "phone", "created_at", "user_type", "grade", "is_approved", "updated_at", "is_certified", "certification_date", "certification_type", "certification_payment_id") VALUES (5, 'decom2soft@gmail.com', '$2a$10$ahjmRtkzrTW5Lvyh9D6LteJRHmJFVODTeBaWievK4mSWINV5l5vNK', '김영철', '0104848887', '2025-07-20T00:53:54.293Z', 'admin', 'bronze', FALSE, '2025-07-20T00:53:54.293Z', FALSE, NULL, NULL, NULL);

-- ============================================
-- 시퀀스 값 복원
-- ============================================

SELECT setval('public.addresses_id_seq', 1, false);
SELECT setval('public.admin_notifications_id_seq', 1, false);
SELECT setval('public.bookings_id_seq', 20, false);
SELECT setval('public.care_managers_id_seq', 6, false);
SELECT setval('public.cart_items_id_seq', 6, false);
SELECT setval('public.favorites_id_seq', 4, false);
SELECT setval('public.inquiries_id_seq', 1, false);
SELECT setval('public.messages_id_seq', 1, false);
SELECT setval('public.notices_id_seq', 2, false);
SELECT setval('public.order_items_id_seq', 1, false);
SELECT setval('public.orders_id_seq', 1, false);
SELECT setval('public.product_categories_id_seq', 16, false);
SELECT setval('public.product_comments_id_seq', 2, false);
SELECT setval('public.product_reviews_id_seq', 1, false);
SELECT setval('public.products_id_seq', 16, false);
SELECT setval('public.services_id_seq', 5, false);
SELECT setval('public.shipping_notifications_id_seq', 1, false);
SELECT setval('public.user_notification_settings_id_seq', 1, false);
SELECT setval('public.user_privacy_settings_id_seq', 1, false);
SELECT setval('public.users_id_seq', 6, false);

-- 백업 완료
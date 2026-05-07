-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: May 07, 2026 at 10:12 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sustainable_marketplace`
--

-- --------------------------------------------------------

--
-- Table structure for table `Cart`
--

CREATE TABLE `Cart` (
  `id` int NOT NULL,
  `consumer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CartItems`
--

CREATE TABLE `CartItems` (
  `id` int NOT NULL,
  `consumer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ConsumerUsers`
--

CREATE TABLE `ConsumerUsers` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Dumping data for table `ConsumerUsers`
--

INSERT INTO `ConsumerUsers` (`id`, `email`, `full_name`, `password`, `city`, `district`, `created_at`) VALUES
(9, 'gulnihal+alice@gmail.com', 'Alice', '$2b$10$um00Aa89WEHaNztS3AElFOZn.5muHH4c/O6biTwdqB/LZsEouoQgC', 'Ankara', 'Çankaya', '2026-05-07 20:28:04'),
(10, 'gulnihal+bob@gmail.com', 'Bob', '$2b$10$qytsY5ohp2UHkZrUar.Bgeovm8zdMH8RgQZg7s.s0q4kT7atn8eA2', 'Ankara', 'Cankaya', '2026-05-07 20:28:41'),
(11, 'gulnihal+charlie@gmail.com', 'Charlie', '$2b$10$A26LTG.we4ESS0yOm/LXH.MiAhr0pNrnepEqNx5Um8lEek8LP5JK2', 'Ankara', 'Sincan', '2026-05-07 20:29:14');

-- --------------------------------------------------------

--
-- Table structure for table `MarketUsers`
--

CREATE TABLE `MarketUsers` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `market_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Dumping data for table `MarketUsers`
--

INSERT INTO `MarketUsers` (`id`, `email`, `market_name`, `password`, `city`, `district`, `created_at`) VALUES
(1, 'contact@tokmarket.com', 'Tok Market', '$2b$10$PO63oJUlcMsVAEkwp51txuFYYbYa.DL1M6XuR4AVL1GtzWusxQ1a6', 'Ankara', 'Bilkent', '2026-05-07 20:08:18'),
(2, 'info@freshcenter.com', 'Fresh Center', '$2b$10$6JgG7PhCATQ7CDe8UcARjeKVWbAhlkvEdsjcKSpILit2XkXVOJuQu', 'Ankara', 'Bilkent', '2026-05-07 20:09:10'),
(3, 'hello@greengrocer.com', 'Green Grocer', '$2b$10$wq1aTx82bHskiG4vo3L5oOKVSR97GwopvT06HLup/lNWTO2z7r8Vi', 'Ankara', 'Yenimahalle', '2026-05-07 20:09:58');

-- --------------------------------------------------------

--
-- Table structure for table `OrderItems`
--

CREATE TABLE `OrderItems` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `OrderItems`
--

INSERT INTO `OrderItems` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(18, 14, 13, 1, 22.50),
(19, 14, 7, 1, 20.00),
(20, 14, 11, 1, 85.00),
(21, 14, 15, 1, 90.00),
(22, 14, 3, 1, 25.00),
(23, 14, 4, 2, 45.00),
(24, 15, 10, 1, 9.90),
(25, 15, 6, 1, 75.00),
(26, 15, 14, 1, 8.00);

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `id` int NOT NULL,
  `consumer_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'ongoing',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`id`, `consumer_id`, `total_price`, `status`, `created_at`) VALUES
(14, 9, 332.50, 'ongoing', '2026-05-07 20:29:50'),
(15, 9, 92.90, 'ongoing', '2026-05-07 20:30:25');

-- --------------------------------------------------------

--
-- Table structure for table `PendingVerifications`
--

CREATE TABLE `PendingVerifications` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `userType` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PendingVerifications`
--

INSERT INTO `PendingVerifications` (`id`, `email`, `code`, `userType`, `name`, `password`, `city`, `district`, `created_at`) VALUES
(14, 'asda@exapmle.com', '142089', 'consumer', 'gulnihal ', '$2b$10$m18CB9A/gppelVA4VDgbneLnxSB9DHZzxER01Bt3ii0Yk3uBrl8pm', 'ok', 'ko', '2026-05-07 21:23:04'),
(15, 'example.gmail.com', '283218', 'consumer', 'g', '$2b$10$xd2SFKg5RdkPZP9aaJcKmuy47TOP3WEodnPU3Yrw1sDX8Tts.XSm2', 'gg', 'gg', '2026-05-07 21:33:23'),
(16, 'example@gmail.com', '712497', 'consumer', 'g', '$2b$10$vtERRn/HvzFE4tMn9ffAAuVni3TsHDNO320hPcaEuGm8pTFaZQa1W', 'gg', 'gg', '2026-05-07 21:33:33');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int NOT NULL,
  `market_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `stock` int NOT NULL DEFAULT '1',
  `original_price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) NOT NULL,
  `expiration_date` date NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `market_id`, `name`, `description`, `stock`, `original_price`, `discounted_price`, `expiration_date`, `image_url`, `created_at`) VALUES
(1, 1, 'Icim Whole Milk 1L', 'Fresh daily milk approaching its expiration date. Unopened and kept in the cold chain.', 12, 35.00, 18.50, '2026-05-08', '/uploads/1778184780497-icim-15-yagli-uht-sut_vs3.png', '2026-05-07 20:10:22'),
(2, 1, 'Sutas Strained Cheese 500g', 'Essential strained cheese for breakfast, nearing its expiration date. Intact packaging.', 8, 85.00, 45.00, '2026-05-10', '/uploads/1778184749285-sutas-500-gr-suzme-z.jpg.avif', '2026-05-07 20:10:22'),
(3, 2, 'Eker Yogurt with Cream 1kg', 'Fresh yogurt preserved without breaking the cold chain. Consume within 2 days.', 4, 55.00, 25.00, '2026-05-08', '/uploads/1778185246856-12501891_1-367792.jpg', '2026-05-07 20:10:22'),
(4, 2, 'Banvit Chicken Breast 500g', 'Ready to cook, fresh chicken breast near expiration. Must be consumed immediately.', 4, 95.00, 45.00, '2026-05-07', '/uploads/1778185278752-68a5de73dd0a9424730843e4.jpg.webp', '2026-05-07 20:10:22'),
(5, 1, 'Ülker Chocolate Wafer (5-Pack)', 'Undamaged package, exactly 1 week left until the end of its shelf life.', 20, 30.00, 15.00, '2026-05-14', '/uploads/1778184936080-images.png', '2026-05-07 20:10:22'),
(6, 3, 'Pınar Kashar Cheese 400g', 'Ideal for sandwiches and toasts, full-fat fresh cheese with a short shelf life remaining.', 3, 145.00, 75.00, '2026-05-10', '/uploads/1778185109675-taze-kasar-400gr.png', '2026-05-07 20:10:22'),
(7, 3, 'Sek Daily Bottled Milk 1L', 'Daily milk in a glass bottle, immediate consumption is highly recommended.', 14, 42.00, 20.00, '2026-05-08', '/uploads/1778185133906-11015405-eb805e.jpg', '2026-05-07 20:10:22'),
(8, 1, 'Uno Whole Wheat Bread', 'Sliced whole wheat bread. Only 2 days left to expiration date.', 10, 32.00, 12.50, '2026-05-08', '/uploads/1778184962122-images-2.jpeg', '2026-05-07 20:10:22'),
(9, 2, 'Dardanel Canned Tuna 3x75g', 'Cans are completely intact, expiration date is at the end of this month.', 14, 160.00, 85.00, '2026-05-24', '/uploads/1778185293327-images.jpeg', '2026-05-07 20:10:22'),
(10, 2, 'Knorr Creamy Mushroom Soup', 'Packaged instant soup, safely stored in a dry, moisture-free environment.', 24, 22.00, 9.90, '2026-05-29', '/uploads/1778185309196-127010130.png.avif', '2026-05-07 20:10:22'),
(11, 3, 'Doğuş Tiryaki Black Tea 1kg', 'Large bulk tea package. Overstock item nearing its expiration date.', 6, 135.00, 85.00, '2026-06-04', '/uploads/1778185149438-1_org_zoom.jpg.webp', '2026-05-07 20:10:22'),
(12, 1, 'Tamek Sour Cherry Nectar 1L', 'Fruit juice, unopened, consume cold before the expiration date.', 18, 38.00, 15.00, '2026-05-17', '/uploads/1778184988474-65823-done.jpg.webp', '2026-05-07 20:10:22'),
(13, 3, 'Lays Oven Baked Yogurt & Herbs', 'Party size potato chips, no crushing or damage in the packaging.', 10, 45.00, 22.50, '2026-05-13', '/uploads/1778185164777-05082085-4da3b8-1650x1650_1_1200x.jpg.webp', '2026-05-07 20:10:22'),
(14, 2, 'Eti Burçak Oat Biscuits', 'Fiber-rich oat biscuits, shelf life is about to expire.', 29, 18.00, 8.00, '2026-05-19', '/uploads/1778185323899-images-2.jpeg', '2026-05-07 20:10:22'),
(15, 1, 'Namet Kangal Sucuk 250g', 'Vacuum package unopened, heat-treated sucuk. Needs refrigeration.', 4, 185.00, 90.00, '2026-05-11', '/uploads/1778185068856-namet-250-gr-dana-kangal-z.jpg.avif', '2026-05-07 20:10:22'),
(16, 3, 'Pınar Organic Eggs (10-Pack)', 'M series organic eggs. Only 4 days left to expiration.', 9, 88.00, 40.00, '2026-05-01', '/uploads/1778185190506-689d61f266ee90c3aef2b5b9.jpg.webp', '2026-05-07 20:10:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Cart`
--
ALTER TABLE `Cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consumer_id` (`consumer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `CartItems`
--
ALTER TABLE `CartItems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`consumer_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `ConsumerUsers`
--
ALTER TABLE `ConsumerUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `MarketUsers`
--
ALTER TABLE `MarketUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `OrderItems`
--
ALTER TABLE `OrderItems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consumer_id` (`consumer_id`);

--
-- Indexes for table `PendingVerifications`
--
ALTER TABLE `PendingVerifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `market_id` (`market_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Cart`
--
ALTER TABLE `Cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `CartItems`
--
ALTER TABLE `CartItems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ConsumerUsers`
--
ALTER TABLE `ConsumerUsers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `MarketUsers`
--
ALTER TABLE `MarketUsers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `OrderItems`
--
ALTER TABLE `OrderItems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `PendingVerifications`
--
ALTER TABLE `PendingVerifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Cart`
--
ALTER TABLE `Cart`
  ADD CONSTRAINT `Cart_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `ConsumerUsers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `CartItems`
--
ALTER TABLE `CartItems`
  ADD CONSTRAINT `fk_cart_consumer` FOREIGN KEY (`consumer_id`) REFERENCES `ConsumerUsers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `OrderItems`
--
ALTER TABLE `OrderItems`
  ADD CONSTRAINT `OrderItems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `OrderItems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`consumer_id`) REFERENCES `ConsumerUsers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `MarketUsers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

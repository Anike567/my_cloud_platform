-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: my_cloud_platform
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e638334c-0d57-11f1-a21b-3ca1725b7228:1-80';

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `android_id` varchar(64) NOT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  `last_sync` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `android_id` (`android_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'d71728dd42704361','dp5h-8bMSL2wOjX-EkwDro:APA91bGsJzuQcGUAdcTE1CpkFMDT8DB3uzMeSde54vLNqxuPxHgeqMuXemJ2lSNxGaUDUCjYQ5cJ79t1DYmYuTN0g2Lc7jTgvZKbeeKoWh5gKLy1940IUWk','019c941b-7927-7114-9909-6f141754229b','2026-02-27 06:58:53');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` varchar(64) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `image_location` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_device_image` (`device_id`,`checksum`),
  CONSTRAINT `fk_device_android` FOREIGN KEY (`device_id`) REFERENCES `devices` (`android_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'d71728dd42704361','c101cf266685b6c0e545e79d21cd3bf9','content://media/external/images/media/1000000865','2026-02-27 06:36:07'),(2,'d71728dd42704361','06ddd1c60a7e760cda36dfb93caa62b9','content://media/external/images/media/1000000868','2026-02-27 06:36:07'),(3,'d71728dd42704361','a1f021c8a50a2d25b48f446aa19183f5','content://media/external/images/media/1000000869','2026-02-27 06:36:07'),(4,'d71728dd42704361','6d13c521ddb3506f7318166fd56ebf12','content://media/external/images/media/1000001141','2026-02-27 06:36:07'),(5,'d71728dd42704361','47c83a75952e9d35877aef82f6d1484b','content://media/external/images/media/1000001865','2026-02-27 06:36:07'),(6,'d71728dd42704361','aa09fca8bbf8405b3b54b36f5c07d577','content://media/external/images/media/1000001866','2026-02-27 06:36:07'),(7,'d71728dd42704361','6b6250c548a0412a3b3dcdbefc140763','content://media/external/images/media/1000001867','2026-02-27 06:36:07'),(8,'d71728dd42704361','1b4c6513741b0f7601402d6139b84613','content://media/external/images/media/1000001872','2026-02-27 06:36:07'),(9,'d71728dd42704361','a4d382b84cdf59283227c50db49394a0','content://media/external/images/media/1000001873','2026-02-27 06:36:07'),(10,'d71728dd42704361','653c9e438a6ce328790b22c294eb7b86','content://media/external/images/media/1000001874','2026-02-27 06:36:07'),(11,'d71728dd42704361','7df7f99d4d0b55fca05eff18cfc43cc7','content://media/external/images/media/1000001875','2026-02-27 06:36:07'),(12,'d71728dd42704361','7bfaed046c68d21431b9e80a93b13734','content://media/external/images/media/1000001884','2026-02-27 06:36:08'),(13,'d71728dd42704361','91b755699472d0550af3ef55e5c11425','content://media/external/images/media/1000001885','2026-02-27 06:36:08'),(14,'d71728dd42704361','d6c89a287b59423a24b0fad471ce0d22','content://media/external/images/media/1000001886','2026-02-27 06:36:08'),(15,'d71728dd42704361','75edfb863bb7d3303ce8c0ec2154ce9d','content://media/external/images/media/1000001887','2026-02-27 06:36:08'),(16,'d71728dd42704361','20aaf3eddf14646ed74b2a1270992a6e','content://media/external/images/media/1000001888','2026-02-27 06:36:08'),(17,'d71728dd42704361','743143ac07fbbbd7904003e9cab65327','content://media/external/images/media/1000001889','2026-02-27 06:36:08'),(18,'d71728dd42704361','35e61cd66a56e6070378055da28d4090','content://media/external/images/media/1000001890','2026-02-27 06:36:08'),(19,'d71728dd42704361','b2962c529c9365bc00490eb1f9a16861','content://media/external/images/media/1000001891','2026-02-27 06:36:08'),(20,'d71728dd42704361','b2c4c72cfbf1155ff1cd3da7ba776a27','content://media/external/images/media/1000001892','2026-02-27 06:36:08'),(21,'d71728dd42704361','468cb8bfc3628e7bf2cde2fc8e22b7bc','content://media/external/images/media/1000001895','2026-02-27 06:36:08'),(22,'d71728dd42704361','30ff7caec1600385c1835b4e5c422ca1','content://media/external/images/media/1000001897','2026-02-27 06:36:08'),(23,'d71728dd42704361','06e4fdddc1cb7c3126343d9ed68c9e54','content://media/external/images/media/1000001900','2026-02-27 06:36:08'),(24,'d71728dd42704361','eddde1620a513e5d0b87ea355f745d64','content://media/external/images/media/1000001902','2026-02-27 06:36:08'),(25,'d71728dd42704361','ca930b732c80ec4414b9a75199585b86','content://media/external/images/media/1000001906','2026-02-27 06:36:08'),(26,'d71728dd42704361','3dd1c6a3e12b9afd4c8cd55c2fad0eba','content://media/external/images/media/1000001909','2026-02-27 06:36:08'),(27,'d71728dd42704361','fe64162b5ac306cd2d16260a9c5a3b5b','content://media/external/images/media/1000001911','2026-02-27 06:36:08'),(28,'d71728dd42704361','9a85407f468818a231e9dd885aa158ae','content://media/external/images/media/1000001912','2026-02-27 06:36:08'),(29,'d71728dd42704361','c604197bee8342bee4b58c9d2a042656','content://media/external/images/media/1000001913','2026-02-27 06:36:08'),(30,'d71728dd42704361','4d8beed2bca083b39615fd56e7b1a0f9','content://media/external/images/media/1000001917','2026-02-27 06:36:08'),(31,'d71728dd42704361','25a18abdd0f1399261e6a26ead8528d2','content://media/external/images/media/1000001921','2026-02-27 06:36:08'),(32,'d71728dd42704361','ab7eabdfa8fd10164a448f62b5ad1c3b','content://media/external/images/media/1000001925','2026-02-27 06:36:08'),(33,'d71728dd42704361','b6d0dd07d0dd363c99d1e824989ccf09','content://media/external/images/media/1000001929','2026-02-27 06:36:08'),(34,'d71728dd42704361','e9a75ab86b3c9fb838734ab0199551cc','content://media/external/images/media/1000001933','2026-02-27 06:36:08'),(35,'d71728dd42704361','5651a471c9b3907718d1c0b71996db9f','content://media/external/images/media/1000001937','2026-02-27 06:36:08'),(36,'d71728dd42704361','0cbde1277b880dd03e8cc2049757faba','content://media/external/images/media/1000001953','2026-02-27 06:36:08'),(37,'d71728dd42704361','5b5ebcf58cd4bd3e77281d0237e028f5','content://media/external/images/media/1000001957','2026-02-27 06:36:09'),(38,'d71728dd42704361','6e3713a38a87d36d4c97e12e275451f1','content://media/external/images/media/1000001961','2026-02-27 06:36:09'),(39,'d71728dd42704361','23d1a01bdd34374b5e777c0b11c4ea38','content://media/external/images/media/1000001965','2026-02-27 06:36:09'),(40,'d71728dd42704361','cc231dbddb1cd89e4b38134a4fa61370','content://media/external/images/media/1000001969','2026-02-27 06:36:09'),(41,'d71728dd42704361','8032688da0d693f94b4813c56d51683f','content://media/external/images/media/1000001973','2026-02-27 06:36:09'),(42,'d71728dd42704361','fcf0fe01340417cb45cadd5b2619d51c','content://media/external/images/media/1000001983','2026-02-27 06:36:09'),(43,'d71728dd42704361','00334accb67056fcc6fefed32e8d0034','content://media/external/images/media/1000001987','2026-02-27 06:36:09'),(44,'d71728dd42704361','a16b37d5d8b5789f882d343dd2165d73','content://media/external/images/media/1000001991','2026-02-27 06:36:09'),(45,'d71728dd42704361','4de8fce32b5e1d77b6c0092ad3531731','content://media/external/images/media/1000002005','2026-02-27 06:36:09'),(46,'d71728dd42704361','0af600e4a4fd8e90c815569f30dc0ad4','content://media/external/images/media/1000002013','2026-02-27 06:36:09'),(47,'d71728dd42704361','f199b0624f91fada71f072b791d83446','content://media/external/images/media/1000002014','2026-02-27 06:36:09'),(48,'d71728dd42704361','49e307f614ed755ed6f4dd36b1c47b1d','content://media/external/images/media/1000002015','2026-02-27 06:36:09'),(49,'d71728dd42704361','406c0e813ea515fcc6babab97d893162','content://media/external/images/media/1000002016','2026-02-27 06:36:09'),(50,'d71728dd42704361','8ce61b67b9e7d16436e22a05b7b4bf69','content://media/external/images/media/1000002017','2026-02-27 06:36:09'),(51,'d71728dd42704361','d2393b86a05370fab3a74c954e61e80e','content://media/external/images/media/1000002018','2026-02-27 06:36:09'),(52,'d71728dd42704361','b6b60b65daf0ef43b2b210d42ccea5e5','content://media/external/images/media/1000002019','2026-02-27 06:36:09'),(53,'d71728dd42704361','0a0490ee5a1014febc2d4ea798c2f8cc','content://media/external/images/media/1000002020','2026-02-27 06:36:09'),(54,'d71728dd42704361','a9451b8126ada20c05d867359a56c7db','content://media/external/images/media/1000002021','2026-02-27 06:36:09'),(55,'d71728dd42704361','c50c628107376c9bcd08cfac3a4f5c30','content://media/external/images/media/1000002049','2026-02-27 06:36:09'),(56,'d71728dd42704361','d50999a3c6380469e625a47d75d1c50f','content://media/external/images/media/1000002053','2026-02-27 06:36:09'),(57,'d71728dd42704361','bd4c82d723ad8981f7bb56817bb26bff','content://media/external/images/media/1000002057','2026-02-27 06:36:09'),(58,'d71728dd42704361','fb1f725120debf288face41917da5499','content://media/external/images/media/1000002365','2026-02-27 06:36:09'),(59,'d71728dd42704361','f54afa084c8bbb4e83a673c017931f63','content://media/external/images/media/1000002366','2026-02-27 06:36:09');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('019c941b-7927-7114-9909-6f141754229b','Aniket','ka344057','ka344057@gmail.com','$2b$10$X8SMU26BZdLKowspC4ey7u/8zvjkRWUywcsQ/a/aqIAlvppi1qWpi','2026-02-25 09:22:34'),('019c9e18-0710-718b-9c84-a7f4f5c1133a','Vishal Kumar','vishal','vishal@gmail.com','$2b$10$WxM3a.HbNqGOSImTyGS0D.nDT3ASyLGkuhXrC0vzA3RCrEOX/i4rO','2026-02-27 07:55:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 15:08:39

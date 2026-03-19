-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: festival_db
-- ------------------------------------------------------
-- Server version	8.0.45

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

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `competency_id` int NOT NULL,
  `experience` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `competency_id` (`competency_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`competency_id`) REFERENCES `competencies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,2,1,'Участвовал в разработке дизайна для 3 коммерческих проектов.','approved','2026-03-17 15:15:32'),(2,2,5,'Создал мобильное приложение на Flutter.','pending','2026-03-17 15:15:32'),(3,3,2,'Участие в хакатонах: 2 место на Kazan Digital.','approved','2026-03-17 15:15:32'),(4,3,3,'Сертификаты по безопасности от Cisco.','pending','2026-03-17 15:15:32'),(5,4,4,'Прошел курсы по машинному обучению на Stepik.','approved','2026-03-17 15:15:32'),(6,5,1,'Портфолио из 10 работ, опыт в дизайн-студии 1 год.','pending','2026-03-17 15:15:32'),(7,6,2,'Разработал несколько проектов на Python.','approved','2026-03-17 15:15:32'),(8,2,5,'123123123','pending','2026-03-17 15:16:57'),(9,7,1,'умею','pending','2026-03-17 15:52:00'),(10,8,1,'люблю рисовать','pending','2026-03-17 18:21:50'),(11,9,1,'круто рисую ','pending','2026-03-19 12:32:41');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competencies`
--

DROP TABLE IF EXISTS `competencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competencies`
--

LOCK TABLES `competencies` WRITE;
/*!40000 ALTER TABLE `competencies` DISABLE KEYS */;
INSERT INTO `competencies` VALUES (1,'Веб-дизайн','Создание современных интерфейсов и пользовательских решений.',NULL,'2026-03-17 15:15:32'),(2,'Разработка ПО','Программирование на различных языках: Java, Python, C++.',NULL,'2026-03-17 15:15:32'),(3,'Кибербезопасность','Защита информации, этичный хакинг, сетевая безопасность.',NULL,'2026-03-17 15:15:32'),(4,'Data Science','Анализ данных, машинное обучение, Python, нейронные сети.',NULL,'2026-03-17 15:15:32'),(5,'Мобильная разработка','Создание приложений для iOS и Android.',NULL,'2026-03-17 15:15:32');
/*!40000 ALTER TABLE `competencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (4,'Кемеровская область'),(1,'Москва'),(5,'Новосибирская область'),(3,'Республика Татарстан'),(2,'Санкт-Петербург');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middlename` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `education` enum('secondary','secondary_special','higher') COLLATE utf8mb4_unicode_ci DEFAULT 'secondary',
  `institution` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('schoolboy','student','specialist') COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Админ','Админ','Админ','admin','$2a$10$MCjFJV.WPBoO1329Z0IVD.JgTWKNAXKZq.x9qhUiUQgQWvRIX2pai','higher','Административная академия',1,NULL,'specialist','admin','2026-03-17 15:15:32'),(2,'Иванов','Иван','Иванович','ivan@example.com','$2a$10$MCjFJV.WPBoO1329Z0IVD.JoKSH7Iq1dvtEceOm671BdKkbLXwoza','higher','МГУ им. Ломоносова',1,'/img/8.png','student','user','2026-03-17 15:15:32'),(3,'Петрова','Мария','Сергеевна','maria@example.com','$2a$10$MCjFJV.WPBoO1329Z0IVD.JoKSH7Iq1dvtEceOm671BdKkbLXwoza','higher','СПбГУ',2,'/img/3.png','student','user','2026-03-17 15:15:32'),(4,'Сидоров','Петр','Алексеевич','petr@example.com','$2a$10$MCjFJV.WPBoO1329Z0IVD.JoKSH7Iq1dvtEceOm671BdKkbLXwoza','higher','КАИ',3,'/img/9.png','specialist','user','2026-03-17 15:15:32'),(5,'Смирнова','Елена','Дмитриевна','elena@example.com','$2a$10$MCjFJV.WPBoO1329Z0IVD.JoKSH7Iq1dvtEceOm671BdKkbLXwoza','secondary_special','Колледж связи ?54',2,'/img/4.png','schoolboy','user','2026-03-17 15:15:32'),(6,'Козлов','Дмитрий','Олегович','dmitry@example.com','$2a$10$MCjFJV.WPBoO1329Z0IVD.JoKSH7Iq1dvtEceOm671BdKkbLXwoza','higher','НГУ',5,'/img/11.png','student','user','2026-03-17 15:15:32'),(7,'ШадоуФиндов','ШАдоуФинд','Шадоуфиндович','example123@mail.ru','$2a$10$ZA36mnxAq41PK7iYkA1bsOTbrLy2I7JWMjttjbA4ThtRQA3eWz9gS','secondary','DOTA 2',3,'/img/5.png','specialist','user','2026-03-17 15:51:48'),(8,'Анастасия','Тарасова',NULL,'nastya@mail.ru','$2a$10$pPg26Z92Vsi5.Brjd91X3.6OIqmvZf7lwdj6f6XXd2q4/YyjmliDO','higher','МГУ',1,'/uploads/photo-1773771694318-807517859.png','student','user','2026-03-17 18:21:34'),(9,'Анастасия','ШАдоуФинд','qweqweqwe','user777@gmail.com','$2a$10$nu1nJHUmWIt7ZvmHeKlflu6Wyy/aaAvB44owoQnzxTgTTc0xMSTaW','secondary_special','DOTA 2',5,'/uploads/photo-1773923534388-416091106.png','schoolboy','user','2026-03-19 12:32:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 20:56:13

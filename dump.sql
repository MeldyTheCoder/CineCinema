-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cine
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `actors`
--

CREATE SCHEMA IF NOT EXISTS `cine`;
USE `cine`;

DROP TABLE IF EXISTS `actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `photo_url` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actors`
--

LOCK TABLES `actors` WRITE;
/*!40000 ALTER TABLE `actors` DISABLE KEYS */;
INSERT INTO `actors` VALUES (1,'Киану','Ривз','https://www.kinomania.ru/sites/default/files/styles/photo/public/person_images/7eabe3a1649ffa2b3ff8c02ebfd5659f.jpeg?itok=Ii6HsIMd'),(2,'Лэнс','Рэддик','data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QFURXhpZgAASUkqAAgAAAAEAA4BAgDtAAAAPgAAAJiCAgARAAAAKwEAABoBBQABAAAAPAEAABsBBQABAAAARAEAAAAAAABIT0xMWVdPT0QsIENBIC0gSkFOVUFSWSAzMDogIExhbmNlIFJlZGRpY2sgYXJyaXZlcyBhdCB0aGUgTG9zIEFuZ2VsZXMgcHJlbWllcmUgb2YgU3VtbWl0IEVudGVydGFpbm1lbnQncyAiSm9obiBXaWNrOiBDaGFwdGVyIFR3byIgaGVsZCBhdCBBcmNMaWdodCBIb2xseXdvb2Qgb24gSmFudWFyeSAzMCwgMjAxNyBpbiBIb2xseXdvb2QsIENhbGlmb3JuaWEuICAoUGhvdG8gYnkgTWljaGFlbCBUcmFuL0ZpbG1NYWdpYykyMDE3IE1pY2hhZWwgVHJhbiwBAAABAAAALAEAAAEAAAD/7QFEUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAASccAlAADE1pY2hhZWwgVHJhbhwCeADtSE9MTFlXT09ELCBDQSAtIEpBTlVBUlkgMzA6ICBMYW5jZSBSZWRkaWNrIGFycml2ZXMgYXQgdGhlIExvcyBBbmdlbGVzIHByZW1pZXJlIG9mIFN1bW1pdCBFbnRlcnRhaW5tZW50J3MgIkpvaG4gV2ljazogQ2hhcHRlciBUd28iIGhlbGQgYXQgQXJjTGlnaHQgSG9sbHl3b29kIG9uIEphbnVhcnkgMzAsIDIwMTcgaW4gSG9sbHl3b29kLCBDYWxpZm9ybmlhLiAgKFBob3RvIGJ5IE1pY2hhZWwgVHJhbi9GaWxtTWFnaWMpHAJ0ABEyMDE3IE1pY2hhZWwgVHJhbhwCbgAJRmlsbU1hZ2ljAP/hBmxodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgZGM6UmlnaHRzPSIyMDE3IE1pY2hhZWwgVHJhbiIgcGhvdG9zaG9wOkNyZWRpdD0iRmlsbU1hZ2ljIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iNjMzMTM4MDIyIiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZXVsYT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+TWljaGFlbCBUcmFuPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5IT0xMWVdPT0QsIENBIC0gSkFOVUFSWSAzMDogIExhbmNlIFJlZGRpY2sgYXJyaXZlcyBhdCB0aGUgTG9z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'),(3,'Matthew','McConaughey','https://m.media-amazon.com/images/M/MV5BMTg0MDc3ODUwOV5BMl5BanBnXkFtZTcwMTk2NjY4Nw@@._V1_FMjpg_UX1000_.jpg'),(4,'Anne','Hathaway','https://upload.wikimedia.org/wikipedia/commons/0/03/Anne_Hathaway_at_The_Apprentice_in_NYC_03_%28cropped2%29.jpg'),(5,'Jessica','Chastain','https://upload.wikimedia.org/wikipedia/commons/1/11/Jessica_Chastain-64631_%28cropped%29.jpg'),(6,'Michael','Caine','https://upload.wikimedia.org/wikipedia/commons/3/3d/Michael_Caine_-_Viennale_2012_g_%28cropped%29.jpg'),(7,'Mackenzie','Foy','https://media.themoviedb.org/t/p/w500/gW9BdiA9eooBWa5bzHWkV7rbTa8.jpg'),(8,'Casey','Affleck','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Casey_Affleck_on_the_Manchester_by_the_Sea_red_carpet_%2830165304696%29_%28cropped_2%29.jpg/250px-Casey_Affleck_on_the_Manchester_by_the_Sea_red_carpet_%2830165304696%29_%28cropped_2%29.jpg'),(9,'Topher','Grace','https://upload.wikimedia.org/wikipedia/commons/9/93/Topher_Grace_2019_by_Glenn_Francis_%283x4_cropped%29.jpg');
/*!40000 ALTER TABLE `actors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('9c2b526c6ec2');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announces`
--

DROP TABLE IF EXISTS `announces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `text` varchar(100) NOT NULL,
  `cover_url` text NOT NULL,
  `film` int DEFAULT NULL,
  `date_closes` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_announces_films_id_film` (`film`),
  CONSTRAINT `fk_announces_films_id_film` FOREIGN KEY (`film`) REFERENCES `films` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announces`
--

LOCK TABLES `announces` WRITE;
/*!40000 ALTER TABLE `announces` DISABLE KEYS */;
/*!40000 ALTER TABLE `announces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mime_type` enum('VIDEO','PHOTO') NOT NULL,
  `attachment_url` varchar(255) NOT NULL,
  `film` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_attachments_films_id_film` (`film`),
  CONSTRAINT `fk_attachments_films_id_film` FOREIGN KEY (`film`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (1,'PHOTO','https://m.media-amazon.com/images/M/MV5BMDE0ZjMzOTAtMzU2OS00ZDVmLWFlMjYtMThlOWYwMDBiN2E3XkEyXkFqcGdeQWFsZWxvZw@@._V1_QL75_UX500_CR0,0,500,281_.jpg',1),(2,'PHOTO','https://static1.srcdn.com/wordpress/wp-content/uploads/2024/05/keanu-reeves-driving-and-looking-angry-in-john-wick.jpg',1),(3,'PHOTO','https://images.squarespace-cdn.com/content/v1/59e512ddf43b55c29c71b996/1508700851704-ENUBHKWWTDLRPV5D0MBX/johnwick.jpg',1),(4,'VIDEO','http://videos.hd-trailers.net/JohnWick-Trailer1_51-1080p-HDTN.mp4',1),(5,'PHOTO','https://upload.wikimedia.org/wikipedia/en/9/9f/John_Wick_Keanu.jpeg',1),(6,'VIDEO','https://shorturl.at/nkxOd',2),(7,'VIDEO','https://shorturl.at/687DD',3),(8,'VIDEO','http://videos.hd-trailers.net/Interstellar_2014_Trailer_4_5.1-1080p-HDTN.mp4',4),(9,'PHOTO','https://b1.filmpro.ru/c/258972.jpg',4),(10,'PHOTO','https://www.kino-teatr.ru/movie/kadr/55826/550937.jpg',4),(11,'PHOTO','https://b1.filmpro.ru/c/258963.jpg',4);
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bonus_logs`
--

DROP TABLE IF EXISTS `bonus_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bonus_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bonuses` int NOT NULL,
  `type` enum('DEPOSIT','WITHDRAWAL') DEFAULT NULL,
  `user` int NOT NULL,
  `order` int NOT NULL,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bonus_logs_users_id_user` (`user`),
  KEY `fk_bonus_logs_orders_id_order` (`order`),
  CONSTRAINT `fk_bonus_logs_orders_id_order` FOREIGN KEY (`order`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_bonus_logs_users_id_user` FOREIGN KEY (`user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bonus_logs`
--

LOCK TABLES `bonus_logs` WRITE;
/*!40000 ALTER TABLE `bonus_logs` DISABLE KEYS */;
INSERT INTO `bonus_logs` VALUES (37,6400,'DEPOSIT',1,51,'2025-06-06 05:29:55');
/*!40000 ALTER TABLE `bonus_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filmactor`
--

DROP TABLE IF EXISTS `filmactor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filmactor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actor` int DEFAULT NULL,
  `film` int DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_filmactor_actors_id_actor` (`actor`),
  KEY `fk_filmactor_films_id_film` (`film`),
  CONSTRAINT `fk_filmactor_actors_id_actor` FOREIGN KEY (`actor`) REFERENCES `actors` (`id`),
  CONSTRAINT `fk_filmactor_films_id_film` FOREIGN KEY (`film`) REFERENCES `films` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filmactor`
--

LOCK TABLES `filmactor` WRITE;
/*!40000 ALTER TABLE `filmactor` DISABLE KEYS */;
INSERT INTO `filmactor` VALUES (1,1,1,'Джон Уик'),(2,2,1,'Харон'),(3,3,4,'Cooper'),(4,4,4,'Brand'),(5,5,4,'Murph (Adult)'),(6,6,4,'Professor Brand'),(7,7,4,'Murph (Young)'),(8,8,4,'Tom Cooper'),(9,9,4,'Gettys');
/*!40000 ALTER TABLE `filmactor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `films`
--

DROP TABLE IF EXISTS `films`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `films` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(4,2) NOT NULL,
  `age_restriction` enum('ZERO_PLUS','SIX_PLUS','TWELVE_PLUS','SIXTEEN_PLUS','EIGHTEEN_PLUS') NOT NULL,
  `duration_seconds` int NOT NULL,
  `cover_url` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `active_date_from` datetime NOT NULL,
  `active_date_to` datetime NOT NULL,
  `director` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `films`
--

LOCK TABLES `films` WRITE;
/*!40000 ALTER TABLE `films` DISABLE KEYS */;
INSERT INTO `films` VALUES (1,'Джон Уик','Джон Уик - на первый взгляд, самый обычный среднестатистический американец, который ведет спокойную мирную жизнь. Однако мало кто знает, что он был наёмным убийцей, причём одним из лучших профессионалов в своём деле.\n\nПосле того как сынок главы бандитской группы со своими приятелями угоняет его любимый «Мустанг» 1969 года выпуска, при этом убив его собаку Дейзи, которая была подарком недавно почившей супруги, Джон вынужден вернуться к своему прошлому. Теперь Уик начинает охоту за теми, кто имел неосторожность перейти ему дорогу, и он готов на всё, чтобы отомстить.',8.90,'EIGHTEEN_PLUS',6060,'https://thumbs.dfs.ivi.ru/storage33/contents/8/a/36e13d271a4c13765a0c2684ad4ddd.jpg',35000,'2024-04-18 00:00:00','2026-05-25 00:00:00','Чад Стахелски'),(2,'Джон Уик 2','Джон Уик - на первый взгляд, самый обычный среднестатистический американец, который ведет спокойную мирную жизнь. Однако мало кто знает, что он был наёмным убийцей, причём одним из лучших профессионалов в своём деле.\n\nПосле того как сынок главы бандитской группы со своими приятелями угоняет его любимый «Мустанг» 1969 года выпуска, при этом убив его собаку Дейзи, которая была подарком недавно почившей супруги, Джон вынужден вернуться к своему прошлому. Теперь Уик начинает охоту за теми, кто имел неосторожность перейти ему дорогу, и он готов на всё, чтобы отомстить.',8.70,'EIGHTEEN_PLUS',6060,'https://upload.wikimedia.org/wikipedia/ru/f/f1/John_Wick_2.jpg',35000,'2024-04-18 00:00:00','2026-05-25 00:00:00','Чад Стахелски'),(3,'Зеленая миля','Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора». Каждый из узников однажды проходит «зеленую милю» по пути к месту казни.',9.10,'SIXTEEN_PLUS',10800,'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p24429_p_v12_bf.jpg',35000,'2023-10-01 00:00:00','2025-06-14 00:00:00','Фрэнк Дарабонт'),(4,'Интерстеллар','Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.',8.60,'TWELVE_PLUS',10200,'https://www.kino-teatr.ru/movie/posters/big/6/2/55826.jpg',40000,'2023-11-15 00:00:00','2025-07-15 00:00:00','Кристофер Нолан'),(5,'Король Лев','Молодой львенок Симба претендует на место своего отца Муфасы в качестве короля саванны.',8.50,'ZERO_PLUS',5280,'https://upload.wikimedia.org/wikipedia/ru/6/62/Lion_king_ver1.jpg',30000,'2023-12-01 00:00:00','2026-04-01 00:00:00','Роджер Аллерс'),(6,'Паразиты','Все члены семьи Ки, оставшись без работы, проникают в богатый дом семейства Пак.',8.60,'SIXTEEN_PLUS',7920,'https://upload.wikimedia.org/wikipedia/ru/7/77/%D0%A4%D0%B8%D0%BB%D1%8C%D0%BC_%D0%9F%D0%B0%D1%80%D0%B0%D0%B7%D0%B8%D1%82%D1%8B_%28Gisaengchung%29.png',38000,'2023-10-20 00:00:00','2026-01-20 00:00:00','Пон Чжун Хо');
/*!40000 ALTER TABLE `films` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `films_genres`
--

DROP TABLE IF EXISTS `films_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `films_genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `genre` int DEFAULT NULL,
  `film` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_films_genres_genres_genre_id` (`genre`),
  KEY `fk_films_genres_films_film_id` (`film`),
  CONSTRAINT `fk_films_genres_films_film_id` FOREIGN KEY (`film`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_films_genres_genres_genre_id` FOREIGN KEY (`genre`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `films_genres`
--

LOCK TABLES `films_genres` WRITE;
/*!40000 ALTER TABLE `films_genres` DISABLE KEYS */;
INSERT INTO `films_genres` VALUES (1,1,1),(2,2,1),(3,1,2),(4,2,2),(5,4,3),(6,6,4),(7,7,4),(8,8,5),(9,9,5),(10,2,6),(11,4,6),(12,10,6);
/*!40000 ALTER TABLE `films_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Боевик'),(4,'Драма'),(10,'Комедия'),(8,'Мультфильм'),(9,'Мюзикл'),(7,'Приключения'),(2,'Триллер'),(6,'Фантастика'),(5,'Фэнтези');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `halls`
--

DROP TABLE IF EXISTS `halls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `halls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `price_factor` decimal(3,2) NOT NULL,
  `columns` int NOT NULL,
  `rows` int NOT NULL,
  `active` tinyint(1) NOT NULL,
  `office` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `fk_halls_offices_id_office` (`office`),
  CONSTRAINT `fk_halls_offices_id_office` FOREIGN KEY (`office`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `halls`
--

LOCK TABLES `halls` WRITE;
/*!40000 ALTER TABLE `halls` DISABLE KEYS */;
INSERT INTO `halls` VALUES (1,'Лазурный',1.00,3,3,1,1),(2,'Рубин',1.20,5,5,1,1),(3,'Изумруд',1.00,3,3,1,2),(44,'Сапфир',1.00,3,3,1,1),(45,'Гранат',1.00,3,3,1,2),(46,'Жемчужина',1.00,3,3,1,3),(47,'Бирюза',1.00,3,3,1,3),(48,'Цитрин',1.20,5,5,1,3),(49,'Алмаз',1.00,3,3,1,4),(50,'Сафир',1.20,5,5,1,4),(51,'Турмалин',1.00,3,3,1,5),(52,'Опал',1.00,3,3,1,5),(53,'Лазурит',1.00,3,3,1,6),(54,'Топаз',1.00,3,3,1,6),(55,'Гелиодор',1.20,5,5,1,6);
/*!40000 ALTER TABLE `halls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(100) NOT NULL,
  `region` int NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_offices_address_region` (`address`,`region`),
  KEY `fk_offices_regions_id_region` (`region`),
  CONSTRAINT `fk_offices_regions_id_region` FOREIGN KEY (`region`) REFERENCES `regions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'ул. Горького, 4/53',1,35.901422,56.867523,1,'ТЦ \"Рубин\"'),(2,'ул. Мусоргского, 52',1,35.901422,56.867523,1,'Звезда'),(3,'ул. Тверская, д. 1',2,37.615600,55.752200,1,'Филиал на Тверской'),(4,'ул. Арбат, д. 5',2,37.615600,55.752200,1,'Филиал на Арбате'),(5,'ул. Невский пр., д. 10',3,56.858400,35.900600,1,'Филиал на Невском'),(6,'ул. Думская, д. 3',3,56.858400,35.900600,1,'Филиал на Думской'),(7,'ул. Ленинградская, д. 7',4,56.858400,35.900600,1,'Филиал на Ленинградской'),(8,'ул. Советская, д. 2',4,56.858400,35.900600,1,'Филиал на Советской');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schedule` int NOT NULL,
  `date_created` datetime NOT NULL,
  `user` int DEFAULT NULL,
  `office` int NOT NULL,
  `status` enum('NOT_PAID','PAID','COMPLETE','POSTPONED','CANCELED','REFUND') NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_schedule_id_schedule` (`schedule`),
  KEY `fk_orders_users_id_user` (`user`),
  KEY `fk_orders_offices_id_office` (`office`),
  CONSTRAINT `fk_orders_offices_id_office` FOREIGN KEY (`office`) REFERENCES `offices` (`id`),
  CONSTRAINT `fk_orders_schedule_id_schedule` FOREIGN KEY (`schedule`) REFERENCES `schedule` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_users_id_user` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (48,4,'2025-06-06 04:49:15',1,1,'COMPLETE',35000),(51,18,'2025-06-06 05:29:54',1,1,'REFUND',128000);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_seats`
--

DROP TABLE IF EXISTS `orders_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seat` int DEFAULT NULL,
  `order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_seats_seats_seat_id` (`seat`),
  KEY `fk_orders_seats_orders_order_id` (`order`),
  CONSTRAINT `fk_orders_seats_orders_order_id` FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_seats_seats_seat_id` FOREIGN KEY (`seat`) REFERENCES `seats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_seats`
--

LOCK TABLES `orders_seats` WRITE;
/*!40000 ALTER TABLE `orders_seats` DISABLE KEYS */;
INSERT INTO `orders_seats` VALUES (64,185,48),(65,151,51),(66,152,51),(67,155,51);
/*!40000 ALTER TABLE `orders_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `status` enum('PENDING','SUCCEEDED','FAILED','REFUNDED') NOT NULL,
  `payment_method` enum('CARD','CASH','BONUSES') NOT NULL,
  `gateway_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payments_orders_id_order` (`order`),
  CONSTRAINT `fk_payments_orders_id_order` FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,70000,'PENDING','CASH',NULL,'2025-06-03 18:06:14',NULL),(2,35000,'SUCCEEDED','BONUSES',NULL,'2025-06-03 18:12:19',NULL),(3,35000,'SUCCEEDED','CARD',NULL,'2025-06-03 18:15:21',NULL),(4,35000,'SUCCEEDED','CARD',NULL,'2025-06-03 18:16:02',NULL),(5,147000,'PENDING','CASH',NULL,'2025-06-03 18:17:12',NULL),(6,140000,'SUCCEEDED','BONUSES',NULL,'2025-06-03 18:17:42',NULL),(7,73500,'SUCCEEDED','BONUSES',NULL,'2025-06-03 18:20:04',NULL),(8,38500,'SUCCEEDED','CARD',NULL,'2025-06-03 18:21:37',NULL),(9,112000,'REFUNDED','CARD',NULL,'2025-06-03 18:24:50',NULL),(10,140000,'REFUNDED','CARD',NULL,'2025-06-03 18:25:55',NULL),(11,35000,'PENDING','CASH',NULL,'2025-06-03 20:48:33',NULL),(12,38500,'REFUNDED','CARD',NULL,'2025-06-03 20:58:30',NULL),(13,35000,'PENDING','CASH',NULL,'2025-06-04 00:52:05',NULL),(14,38500,'PENDING','CASH',NULL,'2025-06-04 01:30:34',NULL),(15,73500,'PENDING','CASH',NULL,'2025-06-04 02:00:57',NULL),(16,38500,'PENDING','CASH',NULL,'2025-06-04 03:06:08',NULL),(17,77000,'PENDING','CASH',NULL,'2025-06-04 03:18:13',NULL),(18,38500,'PENDING','CASH',NULL,'2025-06-04 03:20:34',NULL),(19,38500,'PENDING','CASH',NULL,'2025-06-04 03:22:08',NULL),(20,38500,'PENDING','CASH',NULL,'2025-06-04 03:23:07',NULL),(21,38500,'PENDING','CASH',NULL,'2025-06-04 03:24:59',NULL),(22,38500,'PENDING','CASH',NULL,'2025-06-04 03:25:55',NULL),(23,77000,'PENDING','CASH',NULL,'2025-06-04 05:37:45',NULL),(24,77000,'PENDING','CASH',NULL,'2025-06-04 06:00:35',NULL),(25,35000,'PENDING','CASH',NULL,'2025-06-06 04:49:15',48),(26,128000,'REFUNDED','CARD',NULL,'2025-06-06 05:29:54',51);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (1,'Тверь',35.900600,56.858400),(2,'Москва',37.615600,55.752200),(3,'Санкт-Петербург',56.858400,35.900600),(4,'Торжок',56.858400,35.900600),(5,'Ульяновск',35.900600,56.858400),(6,'Чебоксары',35.900600,56.858400),(7,'Кимры',35.900600,56.858400),(8,'Ржев',35.900600,56.858400),(10,'Норильск',35.900600,56.858400);
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hall` int NOT NULL,
  `time` int NOT NULL,
  `film` int NOT NULL,
  `day_id` int NOT NULL,
  `year` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedule_halls_id_hall` (`hall`),
  KEY `fk_schedule_films_id_film` (`film`),
  CONSTRAINT `fk_schedule_films_id_film` FOREIGN KEY (`film`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_halls_id_hall` FOREIGN KEY (`hall`) REFERENCES `halls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,10980,1,134,2025),(2,3,11980,1,330,2025),(3,1,11980,1,330,2025),(4,1,10980,1,330,2025),(5,3,15000,3,330,2025),(7,3,37000,3,331,2025),(8,3,30000,3,330,2025),(9,3,45000,3,331,2025),(10,44,15000,3,330,2025),(11,44,37000,3,331,2025),(12,44,30000,3,330,2025),(13,44,45000,3,331,2025),(14,44,15000,4,330,2025),(15,44,37000,4,332,2025),(16,44,30000,4,330,2025),(17,44,45000,4,332,2025),(18,1,15000,4,330,2025),(19,1,37000,4,332,2025),(20,1,30000,4,330,2025),(21,1,45000,4,332,2025),(22,3,15000,4,330,2025),(23,3,37000,4,332,2025),(24,3,30000,4,330,2025),(25,3,45000,4,332,2025);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `row` int NOT NULL,
  `column` int NOT NULL,
  `hall` int NOT NULL,
  `price_factor` decimal(3,2) NOT NULL,
  `type` enum('STANDART','VIP','DISABLED') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_seats_halls_id_hall` (`hall`),
  CONSTRAINT `fk_seats_halls_id_hall` FOREIGN KEY (`hall`) REFERENCES `halls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (150,1,6,1,1.10,'VIP'),(151,1,7,1,1.10,'VIP'),(152,1,8,1,1.10,'VIP'),(153,2,6,1,1.00,'STANDART'),(154,2,7,1,1.00,'STANDART'),(155,2,8,1,1.00,'STANDART'),(156,3,6,1,1.00,'STANDART'),(157,3,7,1,1.00,'STANDART'),(158,3,8,1,1.00,'STANDART'),(159,4,6,1,1.10,'STANDART'),(160,4,7,1,1.10,'STANDART'),(161,4,8,1,1.10,'STANDART'),(162,5,6,1,1.00,'STANDART'),(163,5,7,1,1.00,'STANDART'),(164,5,8,1,1.00,'STANDART'),(165,6,6,1,1.00,'STANDART'),(166,6,7,1,1.00,'STANDART'),(167,6,8,1,1.00,'STANDART'),(168,1,12,1,1.10,'VIP'),(169,1,13,1,1.10,'VIP'),(170,1,14,1,1.10,'VIP'),(171,2,12,1,1.00,'STANDART'),(172,2,13,1,1.00,'STANDART'),(173,2,14,1,1.00,'STANDART'),(174,3,12,1,1.00,'STANDART'),(175,3,13,1,1.00,'STANDART'),(176,3,14,1,1.00,'STANDART'),(177,4,12,1,1.10,'STANDART'),(178,4,13,1,1.10,'STANDART'),(179,4,14,1,1.10,'STANDART'),(180,5,12,1,1.00,'STANDART'),(181,5,13,1,1.00,'STANDART'),(182,5,14,1,1.00,'STANDART'),(183,6,12,1,1.00,'STANDART'),(184,6,13,1,1.00,'STANDART'),(185,6,14,1,1.00,'STANDART'),(186,7,12,1,1.00,'DISABLED'),(187,7,13,1,1.00,'DISABLED'),(188,7,14,1,1.00,'DISABLED'),(189,1,6,2,1.10,'VIP'),(190,1,7,2,1.10,'VIP'),(191,1,8,2,1.10,'VIP'),(192,2,6,2,1.00,'STANDART'),(193,2,7,2,1.00,'STANDART'),(194,2,8,2,1.00,'STANDART'),(195,3,6,2,1.00,'STANDART'),(196,3,7,2,1.00,'STANDART'),(197,3,8,2,1.00,'STANDART'),(198,4,6,2,1.10,'STANDART'),(199,4,7,2,1.10,'STANDART'),(200,4,8,2,1.10,'STANDART'),(201,5,6,2,1.00,'STANDART'),(202,5,7,2,1.00,'STANDART'),(203,5,8,2,1.00,'STANDART'),(204,6,6,2,1.00,'STANDART'),(205,6,7,2,1.00,'STANDART'),(206,6,8,2,1.00,'STANDART'),(207,1,12,2,1.10,'VIP'),(208,1,13,2,1.10,'VIP'),(209,1,14,2,1.10,'VIP'),(210,2,12,2,1.00,'STANDART'),(211,2,13,2,1.00,'STANDART'),(212,2,14,2,1.00,'STANDART'),(213,3,12,2,1.00,'STANDART'),(214,3,13,2,1.00,'STANDART'),(215,3,14,2,1.00,'STANDART'),(216,4,12,2,1.10,'STANDART'),(217,4,13,2,1.10,'STANDART'),(218,4,14,2,1.10,'STANDART'),(219,5,12,2,1.00,'STANDART'),(220,5,13,2,1.00,'STANDART'),(221,5,14,2,1.00,'STANDART'),(222,6,12,2,1.00,'STANDART'),(223,6,13,2,1.00,'STANDART'),(224,6,14,2,1.00,'STANDART'),(225,7,12,2,1.00,'DISABLED'),(226,7,13,2,1.00,'DISABLED'),(227,7,14,2,1.00,'DISABLED'),(228,1,6,3,1.10,'VIP'),(229,1,7,3,1.10,'VIP'),(230,1,8,3,1.10,'VIP'),(231,2,6,3,1.00,'STANDART'),(232,2,7,3,1.00,'STANDART'),(233,2,8,3,1.00,'STANDART'),(234,3,6,3,1.00,'STANDART'),(235,3,7,3,1.00,'STANDART'),(236,3,8,3,1.00,'STANDART'),(237,4,6,3,1.10,'STANDART'),(238,4,7,3,1.10,'STANDART'),(239,4,8,3,1.10,'STANDART'),(240,5,6,3,1.00,'STANDART'),(241,5,7,3,1.00,'STANDART'),(242,5,8,3,1.00,'STANDART'),(243,6,6,3,1.00,'STANDART'),(244,6,7,3,1.00,'STANDART'),(245,6,8,3,1.00,'STANDART'),(246,1,12,3,1.10,'VIP'),(247,1,13,3,1.10,'VIP'),(248,1,14,3,1.10,'VIP'),(249,2,12,3,1.00,'STANDART'),(250,2,13,3,1.00,'STANDART'),(251,2,14,3,1.00,'STANDART'),(252,3,12,3,1.00,'STANDART'),(253,3,13,3,1.00,'STANDART'),(254,3,14,3,1.00,'STANDART'),(255,4,12,3,1.10,'STANDART'),(256,4,13,3,1.10,'STANDART'),(257,4,14,3,1.10,'STANDART'),(258,5,12,3,1.00,'STANDART'),(259,5,13,3,1.00,'STANDART'),(260,5,14,3,1.00,'STANDART'),(261,6,12,3,1.00,'STANDART'),(262,6,13,3,1.00,'STANDART'),(263,6,14,3,1.00,'STANDART'),(264,7,12,3,1.00,'DISABLED'),(265,7,13,3,1.00,'DISABLED'),(266,7,14,3,1.00,'DISABLED'),(618,1,6,44,1.10,'VIP'),(619,1,7,44,1.10,'VIP'),(620,1,8,44,1.10,'VIP'),(621,2,6,44,1.00,'STANDART'),(622,2,7,44,1.00,'STANDART'),(623,2,8,44,1.00,'STANDART'),(624,3,6,44,1.00,'STANDART'),(625,3,7,44,1.00,'STANDART'),(626,3,8,44,1.00,'STANDART'),(627,4,6,44,1.10,'STANDART'),(628,4,7,44,1.10,'STANDART'),(629,4,8,44,1.10,'STANDART'),(630,5,6,44,1.00,'STANDART'),(631,5,7,44,1.00,'STANDART'),(632,5,8,44,1.00,'STANDART'),(633,6,6,44,1.00,'STANDART'),(634,6,7,44,1.00,'STANDART'),(635,6,8,44,1.00,'STANDART'),(636,1,12,44,1.10,'VIP'),(637,1,13,44,1.10,'VIP'),(638,1,14,44,1.10,'VIP'),(639,2,12,44,1.00,'STANDART'),(640,2,13,44,1.00,'STANDART'),(641,2,14,44,1.00,'STANDART'),(642,3,12,44,1.00,'STANDART'),(643,3,13,44,1.00,'STANDART'),(644,3,14,44,1.00,'STANDART'),(645,4,12,44,1.10,'STANDART'),(646,4,13,44,1.10,'STANDART'),(647,4,14,44,1.10,'STANDART'),(648,5,12,44,1.00,'STANDART'),(649,5,13,44,1.00,'STANDART'),(650,5,14,44,1.00,'STANDART'),(651,6,12,44,1.00,'STANDART'),(652,6,13,44,1.00,'STANDART'),(653,6,14,44,1.00,'STANDART'),(654,7,12,44,1.00,'DISABLED'),(655,7,13,44,1.00,'DISABLED'),(656,7,14,44,1.00,'DISABLED'),(657,1,6,45,1.10,'VIP'),(658,1,7,45,1.10,'VIP'),(659,1,8,45,1.10,'VIP'),(660,2,6,45,1.00,'STANDART'),(661,2,7,45,1.00,'STANDART'),(662,2,8,45,1.00,'STANDART'),(663,3,6,45,1.00,'STANDART'),(664,3,7,45,1.00,'STANDART'),(665,3,8,45,1.00,'STANDART'),(666,4,6,45,1.10,'STANDART'),(667,4,7,45,1.10,'STANDART'),(668,4,8,45,1.10,'STANDART'),(669,5,6,45,1.00,'STANDART'),(670,5,7,45,1.00,'STANDART'),(671,5,8,45,1.00,'STANDART'),(672,6,6,45,1.00,'STANDART'),(673,6,7,45,1.00,'STANDART'),(674,6,8,45,1.00,'STANDART'),(675,1,12,45,1.10,'VIP'),(676,1,13,45,1.10,'VIP'),(677,1,14,45,1.10,'VIP'),(678,2,12,45,1.00,'STANDART'),(679,2,13,45,1.00,'STANDART'),(680,2,14,45,1.00,'STANDART'),(681,3,12,45,1.00,'STANDART'),(682,3,13,45,1.00,'STANDART'),(683,3,14,45,1.00,'STANDART'),(684,4,12,45,1.10,'STANDART'),(685,4,13,45,1.10,'STANDART'),(686,4,14,45,1.10,'STANDART'),(687,5,12,45,1.00,'STANDART'),(688,5,13,45,1.00,'STANDART'),(689,5,14,45,1.00,'STANDART'),(690,6,12,45,1.00,'STANDART'),(691,6,13,45,1.00,'STANDART'),(692,6,14,45,1.00,'STANDART'),(693,7,12,45,1.00,'DISABLED'),(694,7,13,45,1.00,'DISABLED'),(695,7,14,45,1.00,'DISABLED'),(696,1,6,46,1.10,'VIP'),(697,1,7,46,1.10,'VIP'),(698,1,8,46,1.10,'VIP'),(699,2,6,46,1.00,'STANDART'),(700,2,7,46,1.00,'STANDART'),(701,2,8,46,1.00,'STANDART'),(702,3,6,46,1.00,'STANDART'),(703,3,7,46,1.00,'STANDART'),(704,3,8,46,1.00,'STANDART'),(705,4,6,46,1.10,'STANDART'),(706,4,7,46,1.10,'STANDART'),(707,4,8,46,1.10,'STANDART'),(708,5,6,46,1.00,'STANDART'),(709,5,7,46,1.00,'STANDART'),(710,5,8,46,1.00,'STANDART'),(711,6,6,46,1.00,'STANDART'),(712,6,7,46,1.00,'STANDART'),(713,6,8,46,1.00,'STANDART'),(714,1,12,46,1.10,'VIP'),(715,1,13,46,1.10,'VIP'),(716,1,14,46,1.10,'VIP'),(717,2,12,46,1.00,'STANDART'),(718,2,13,46,1.00,'STANDART'),(719,2,14,46,1.00,'STANDART'),(720,3,12,46,1.00,'STANDART'),(721,3,13,46,1.00,'STANDART'),(722,3,14,46,1.00,'STANDART'),(723,4,12,46,1.10,'STANDART'),(724,4,13,46,1.10,'STANDART'),(725,4,14,46,1.10,'STANDART'),(726,5,12,46,1.00,'STANDART'),(727,5,13,46,1.00,'STANDART'),(728,5,14,46,1.00,'STANDART'),(729,6,12,46,1.00,'STANDART'),(730,6,13,46,1.00,'STANDART'),(731,6,14,46,1.00,'STANDART'),(732,7,12,46,1.00,'DISABLED'),(733,7,13,46,1.00,'DISABLED'),(734,7,14,46,1.00,'DISABLED'),(735,1,6,47,1.10,'VIP'),(736,1,7,47,1.10,'VIP'),(737,1,8,47,1.10,'VIP'),(738,2,6,47,1.00,'STANDART'),(739,2,7,47,1.00,'STANDART'),(740,2,8,47,1.00,'STANDART'),(741,3,6,47,1.00,'STANDART'),(742,3,7,47,1.00,'STANDART'),(743,3,8,47,1.00,'STANDART'),(744,4,6,47,1.10,'STANDART'),(745,4,7,47,1.10,'STANDART'),(746,4,8,47,1.10,'STANDART'),(747,5,6,47,1.00,'STANDART'),(748,5,7,47,1.00,'STANDART'),(749,5,8,47,1.00,'STANDART'),(750,6,6,47,1.00,'STANDART'),(751,6,7,47,1.00,'STANDART'),(752,6,8,47,1.00,'STANDART'),(753,1,12,47,1.10,'VIP'),(754,1,13,47,1.10,'VIP'),(755,1,14,47,1.10,'VIP'),(756,2,12,47,1.00,'STANDART'),(757,2,13,47,1.00,'STANDART'),(758,2,14,47,1.00,'STANDART'),(759,3,12,47,1.00,'STANDART'),(760,3,13,47,1.00,'STANDART'),(761,3,14,47,1.00,'STANDART'),(762,4,12,47,1.10,'STANDART'),(763,4,13,47,1.10,'STANDART'),(764,4,14,47,1.10,'STANDART'),(765,5,12,47,1.00,'STANDART'),(766,5,13,47,1.00,'STANDART'),(767,5,14,47,1.00,'STANDART'),(768,6,12,47,1.00,'STANDART'),(769,6,13,47,1.00,'STANDART'),(770,6,14,47,1.00,'STANDART'),(771,7,12,47,1.00,'DISABLED'),(772,7,13,47,1.00,'DISABLED'),(773,7,14,47,1.00,'DISABLED'),(774,1,6,48,1.10,'VIP'),(775,1,7,48,1.10,'VIP'),(776,1,8,48,1.10,'VIP'),(777,2,6,48,1.00,'STANDART'),(778,2,7,48,1.00,'STANDART'),(779,2,8,48,1.00,'STANDART'),(780,3,6,48,1.00,'STANDART'),(781,3,7,48,1.00,'STANDART'),(782,3,8,48,1.00,'STANDART'),(783,4,6,48,1.10,'STANDART'),(784,4,7,48,1.10,'STANDART'),(785,4,8,48,1.10,'STANDART'),(786,5,6,48,1.00,'STANDART'),(787,5,7,48,1.00,'STANDART'),(788,5,8,48,1.00,'STANDART'),(789,6,6,48,1.00,'STANDART'),(790,6,7,48,1.00,'STANDART'),(791,6,8,48,1.00,'STANDART'),(792,1,12,48,1.10,'VIP'),(793,1,13,48,1.10,'VIP'),(794,1,14,48,1.10,'VIP'),(795,2,12,48,1.00,'STANDART'),(796,2,13,48,1.00,'STANDART'),(797,2,14,48,1.00,'STANDART'),(798,3,12,48,1.00,'STANDART'),(799,3,13,48,1.00,'STANDART'),(800,3,14,48,1.00,'STANDART'),(801,4,12,48,1.10,'STANDART'),(802,4,13,48,1.10,'STANDART'),(803,4,14,48,1.10,'STANDART'),(804,5,12,48,1.00,'STANDART'),(805,5,13,48,1.00,'STANDART'),(806,5,14,48,1.00,'STANDART'),(807,6,12,48,1.00,'STANDART'),(808,6,13,48,1.00,'STANDART'),(809,6,14,48,1.00,'STANDART'),(810,7,12,48,1.00,'DISABLED'),(811,7,13,48,1.00,'DISABLED'),(812,7,14,48,1.00,'DISABLED'),(813,1,6,49,1.10,'VIP'),(814,1,7,49,1.10,'VIP'),(815,1,8,49,1.10,'VIP'),(816,2,6,49,1.00,'STANDART'),(817,2,7,49,1.00,'STANDART'),(818,2,8,49,1.00,'STANDART'),(819,3,6,49,1.00,'STANDART'),(820,3,7,49,1.00,'STANDART'),(821,3,8,49,1.00,'STANDART'),(822,4,6,49,1.10,'STANDART'),(823,4,7,49,1.10,'STANDART'),(824,4,8,49,1.10,'STANDART'),(825,5,6,49,1.00,'STANDART'),(826,5,7,49,1.00,'STANDART'),(827,5,8,49,1.00,'STANDART'),(828,6,6,49,1.00,'STANDART'),(829,6,7,49,1.00,'STANDART'),(830,6,8,49,1.00,'STANDART'),(831,1,12,49,1.10,'VIP'),(832,1,13,49,1.10,'VIP'),(833,1,14,49,1.10,'VIP'),(834,2,12,49,1.00,'STANDART'),(835,2,13,49,1.00,'STANDART'),(836,2,14,49,1.00,'STANDART'),(837,3,12,49,1.00,'STANDART'),(838,3,13,49,1.00,'STANDART'),(839,3,14,49,1.00,'STANDART'),(840,4,12,49,1.10,'STANDART'),(841,4,13,49,1.10,'STANDART'),(842,4,14,49,1.10,'STANDART'),(843,5,12,49,1.00,'STANDART'),(844,5,13,49,1.00,'STANDART'),(845,5,14,49,1.00,'STANDART'),(846,6,12,49,1.00,'STANDART'),(847,6,13,49,1.00,'STANDART'),(848,6,14,49,1.00,'STANDART'),(849,7,12,49,1.00,'DISABLED'),(850,7,13,49,1.00,'DISABLED'),(851,7,14,49,1.00,'DISABLED'),(852,1,6,50,1.10,'VIP'),(853,1,7,50,1.10,'VIP'),(854,1,8,50,1.10,'VIP'),(855,2,6,50,1.00,'STANDART'),(856,2,7,50,1.00,'STANDART'),(857,2,8,50,1.00,'STANDART'),(858,3,6,50,1.00,'STANDART'),(859,3,7,50,1.00,'STANDART'),(860,3,8,50,1.00,'STANDART'),(861,4,6,50,1.10,'STANDART'),(862,4,7,50,1.10,'STANDART'),(863,4,8,50,1.10,'STANDART'),(864,5,6,50,1.00,'STANDART'),(865,5,7,50,1.00,'STANDART'),(866,5,8,50,1.00,'STANDART'),(867,6,6,50,1.00,'STANDART'),(868,6,7,50,1.00,'STANDART'),(869,6,8,50,1.00,'STANDART'),(870,1,12,50,1.10,'VIP'),(871,1,13,50,1.10,'VIP'),(872,1,14,50,1.10,'VIP'),(873,2,12,50,1.00,'STANDART'),(874,2,13,50,1.00,'STANDART'),(875,2,14,50,1.00,'STANDART'),(876,3,12,50,1.00,'STANDART'),(877,3,13,50,1.00,'STANDART'),(878,3,14,50,1.00,'STANDART'),(879,4,12,50,1.10,'STANDART'),(880,4,13,50,1.10,'STANDART'),(881,4,14,50,1.10,'STANDART'),(882,5,12,50,1.00,'STANDART'),(883,5,13,50,1.00,'STANDART'),(884,5,14,50,1.00,'STANDART'),(885,6,12,50,1.00,'STANDART'),(886,6,13,50,1.00,'STANDART'),(887,6,14,50,1.00,'STANDART'),(888,7,12,50,1.00,'DISABLED'),(889,7,13,50,1.00,'DISABLED'),(890,7,14,50,1.00,'DISABLED'),(891,1,6,51,1.10,'VIP'),(892,1,7,51,1.10,'VIP'),(893,1,8,51,1.10,'VIP'),(894,2,6,51,1.00,'STANDART'),(895,2,7,51,1.00,'STANDART'),(896,2,8,51,1.00,'STANDART'),(897,3,6,51,1.00,'STANDART'),(898,3,7,51,1.00,'STANDART'),(899,3,8,51,1.00,'STANDART'),(900,4,6,51,1.10,'STANDART'),(901,4,7,51,1.10,'STANDART'),(902,4,8,51,1.10,'STANDART'),(903,5,6,51,1.00,'STANDART'),(904,5,7,51,1.00,'STANDART'),(905,5,8,51,1.00,'STANDART'),(906,6,6,51,1.00,'STANDART'),(907,6,7,51,1.00,'STANDART'),(908,6,8,51,1.00,'STANDART'),(909,1,12,51,1.10,'VIP'),(910,1,13,51,1.10,'VIP'),(911,1,14,51,1.10,'VIP'),(912,2,12,51,1.00,'STANDART'),(913,2,13,51,1.00,'STANDART'),(914,2,14,51,1.00,'STANDART'),(915,3,12,51,1.00,'STANDART'),(916,3,13,51,1.00,'STANDART'),(917,3,14,51,1.00,'STANDART'),(918,4,12,51,1.10,'STANDART'),(919,4,13,51,1.10,'STANDART'),(920,4,14,51,1.10,'STANDART'),(921,5,12,51,1.00,'STANDART'),(922,5,13,51,1.00,'STANDART'),(923,5,14,51,1.00,'STANDART'),(924,6,12,51,1.00,'STANDART'),(925,6,13,51,1.00,'STANDART'),(926,6,14,51,1.00,'STANDART'),(927,7,12,51,1.00,'DISABLED'),(928,7,13,51,1.00,'DISABLED'),(929,7,14,51,1.00,'DISABLED'),(930,1,6,52,1.10,'VIP'),(931,1,7,52,1.10,'VIP'),(932,1,8,52,1.10,'VIP'),(933,2,6,52,1.00,'STANDART'),(934,2,7,52,1.00,'STANDART'),(935,2,8,52,1.00,'STANDART'),(936,3,6,52,1.00,'STANDART'),(937,3,7,52,1.00,'STANDART'),(938,3,8,52,1.00,'STANDART'),(939,4,6,52,1.10,'STANDART'),(940,4,7,52,1.10,'STANDART'),(941,4,8,52,1.10,'STANDART'),(942,5,6,52,1.00,'STANDART'),(943,5,7,52,1.00,'STANDART'),(944,5,8,52,1.00,'STANDART'),(945,6,6,52,1.00,'STANDART'),(946,6,7,52,1.00,'STANDART'),(947,6,8,52,1.00,'STANDART'),(948,1,12,52,1.10,'VIP'),(949,1,13,52,1.10,'VIP'),(950,1,14,52,1.10,'VIP'),(951,2,12,52,1.00,'STANDART'),(952,2,13,52,1.00,'STANDART'),(953,2,14,52,1.00,'STANDART'),(954,3,12,52,1.00,'STANDART'),(955,3,13,52,1.00,'STANDART'),(956,3,14,52,1.00,'STANDART'),(957,4,12,52,1.10,'STANDART'),(958,4,13,52,1.10,'STANDART'),(959,4,14,52,1.10,'STANDART'),(960,5,12,52,1.00,'STANDART'),(961,5,13,52,1.00,'STANDART'),(962,5,14,52,1.00,'STANDART'),(963,6,12,52,1.00,'STANDART'),(964,6,13,52,1.00,'STANDART'),(965,6,14,52,1.00,'STANDART'),(966,7,12,52,1.00,'DISABLED'),(967,7,13,52,1.00,'DISABLED'),(968,7,14,52,1.00,'DISABLED'),(969,1,6,53,1.10,'VIP'),(970,1,7,53,1.10,'VIP'),(971,1,8,53,1.10,'VIP'),(972,2,6,53,1.00,'STANDART'),(973,2,7,53,1.00,'STANDART'),(974,2,8,53,1.00,'STANDART'),(975,3,6,53,1.00,'STANDART'),(976,3,7,53,1.00,'STANDART'),(977,3,8,53,1.00,'STANDART'),(978,4,6,53,1.10,'STANDART'),(979,4,7,53,1.10,'STANDART'),(980,4,8,53,1.10,'STANDART'),(981,5,6,53,1.00,'STANDART'),(982,5,7,53,1.00,'STANDART'),(983,5,8,53,1.00,'STANDART'),(984,6,6,53,1.00,'STANDART'),(985,6,7,53,1.00,'STANDART'),(986,6,8,53,1.00,'STANDART'),(987,1,12,53,1.10,'VIP'),(988,1,13,53,1.10,'VIP'),(989,1,14,53,1.10,'VIP'),(990,2,12,53,1.00,'STANDART'),(991,2,13,53,1.00,'STANDART'),(992,2,14,53,1.00,'STANDART'),(993,3,12,53,1.00,'STANDART'),(994,3,13,53,1.00,'STANDART'),(995,3,14,53,1.00,'STANDART'),(996,4,12,53,1.10,'STANDART'),(997,4,13,53,1.10,'STANDART'),(998,4,14,53,1.10,'STANDART'),(999,5,12,53,1.00,'STANDART'),(1000,5,13,53,1.00,'STANDART'),(1001,5,14,53,1.00,'STANDART'),(1002,6,12,53,1.00,'STANDART'),(1003,6,13,53,1.00,'STANDART'),(1004,6,14,53,1.00,'STANDART'),(1005,7,12,53,1.00,'DISABLED'),(1006,7,13,53,1.00,'DISABLED'),(1007,7,14,53,1.00,'DISABLED'),(1008,1,6,54,1.10,'VIP'),(1009,1,7,54,1.10,'VIP'),(1010,1,8,54,1.10,'VIP'),(1011,2,6,54,1.00,'STANDART'),(1012,2,7,54,1.00,'STANDART'),(1013,2,8,54,1.00,'STANDART'),(1014,3,6,54,1.00,'STANDART'),(1015,3,7,54,1.00,'STANDART'),(1016,3,8,54,1.00,'STANDART'),(1017,4,6,54,1.10,'STANDART'),(1018,4,7,54,1.10,'STANDART'),(1019,4,8,54,1.10,'STANDART'),(1020,5,6,54,1.00,'STANDART'),(1021,5,7,54,1.00,'STANDART'),(1022,5,8,54,1.00,'STANDART'),(1023,6,6,54,1.00,'STANDART'),(1024,6,7,54,1.00,'STANDART'),(1025,6,8,54,1.00,'STANDART'),(1026,1,12,54,1.10,'VIP'),(1027,1,13,54,1.10,'VIP'),(1028,1,14,54,1.10,'VIP'),(1029,2,12,54,1.00,'STANDART'),(1030,2,13,54,1.00,'STANDART'),(1031,2,14,54,1.00,'STANDART'),(1032,3,12,54,1.00,'STANDART'),(1033,3,13,54,1.00,'STANDART'),(1034,3,14,54,1.00,'STANDART'),(1035,4,12,54,1.10,'STANDART'),(1036,4,13,54,1.10,'STANDART'),(1037,4,14,54,1.10,'STANDART'),(1038,5,12,54,1.00,'STANDART'),(1039,5,13,54,1.00,'STANDART'),(1040,5,14,54,1.00,'STANDART'),(1041,6,12,54,1.00,'STANDART'),(1042,6,13,54,1.00,'STANDART'),(1043,6,14,54,1.00,'STANDART'),(1044,7,12,54,1.00,'DISABLED'),(1045,7,13,54,1.00,'DISABLED'),(1046,7,14,54,1.00,'DISABLED'),(1047,1,6,55,1.10,'VIP'),(1048,1,7,55,1.10,'VIP'),(1049,1,8,55,1.10,'VIP'),(1050,2,6,55,1.00,'STANDART'),(1051,2,7,55,1.00,'STANDART'),(1052,2,8,55,1.00,'STANDART'),(1053,3,6,55,1.00,'STANDART'),(1054,3,7,55,1.00,'STANDART'),(1055,3,8,55,1.00,'STANDART'),(1056,4,6,55,1.10,'STANDART'),(1057,4,7,55,1.10,'STANDART'),(1058,4,8,55,1.10,'STANDART'),(1059,5,6,55,1.00,'STANDART'),(1060,5,7,55,1.00,'STANDART'),(1061,5,8,55,1.00,'STANDART'),(1062,6,6,55,1.00,'STANDART'),(1063,6,7,55,1.00,'STANDART'),(1064,6,8,55,1.00,'STANDART'),(1065,1,12,55,1.10,'VIP'),(1066,1,13,55,1.10,'VIP'),(1067,1,14,55,1.10,'VIP'),(1068,2,12,55,1.00,'STANDART'),(1069,2,13,55,1.00,'STANDART'),(1070,2,14,55,1.00,'STANDART'),(1071,3,12,55,1.00,'STANDART'),(1072,3,13,55,1.00,'STANDART'),(1073,3,14,55,1.00,'STANDART'),(1074,4,12,55,1.10,'STANDART'),(1075,4,13,55,1.10,'STANDART'),(1076,4,14,55,1.10,'STANDART'),(1077,5,12,55,1.00,'STANDART'),(1078,5,13,55,1.00,'STANDART'),(1079,5,14,55,1.00,'STANDART'),(1080,6,12,55,1.00,'STANDART'),(1081,6,13,55,1.00,'STANDART'),(1082,6,14,55,1.00,'STANDART'),(1083,7,12,55,1.00,'DISABLED'),(1084,7,13,55,1.00,'DISABLED'),(1085,7,14,55,1.00,'DISABLED');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `avatar` text,
  `registration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Кирилл','','79997802412','mail@mail1.ru','avatars/user_1.jpg','2025-05-01 00:00:00'),(2,'Мама',NULL,'79043506600',NULL,NULL,'2025-05-01 00:00:00'),(3,'Надежда',NULL,'79201603602',NULL,NULL,'2025-05-01 00:00:00'),(4,'Sunday',NULL,'79852521050',NULL,NULL,'2025-05-01 00:00:00'),(5,'Кирюха','Грошелев','79582521050','mail@mail1.ru','avatars/user_5.jpg','2025-05-01 00:00:00'),(6,'Светлана','Грошелева','79157102081','svetlanasobina7@gmail.com','avatars/user_6.jpg','2025-09-21 00:00:00'),(7,'Кирюха',NULL,'79997802413',NULL,NULL,'2025-06-01 23:05:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cine'
--

--
-- Dumping routines for database 'cine'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06  5:38:59

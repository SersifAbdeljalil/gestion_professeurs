-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 20 fév. 2025 à 10:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_professeurs`
--

-- --------------------------------------------------------

--
-- Structure de la table `professeurs`
--

CREATE TABLE `professeurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `matieres` text DEFAULT NULL,
  `statut` enum('permanent','vacataire') NOT NULL,
  `photo_profil` varchar(255) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `professeurs`
--

INSERT INTO `professeurs` (`id`, `nom`, `prenom`, `email`, `telephone`, `matieres`, `statut`, `photo_profil`, `mot_de_passe`, `date_creation`, `reset_code`) VALUES
(2, 'Kabajj', 'Laila', 'kabajj@gmail.com', '0678943566', 'web', 'vacataire', '/uploads/1739797156902-Capture d\'Ã©cran 2025-02-15 110726.png', '$2b$10$LTsFXN/9m/u5gP31u67COO4bX9h3s6tXQhy0vzeZZsggr7dwzGKWS', '2025-01-28 19:22:46', NULL),
(3, 'Ahmed', 'Jadd', 'ahmed@gmail.com', '0654237892', 'powerskills', 'permanent', '/uploads/1739740168711-profil11.jpg', '$2b$10$F1/EL9xdJQ6EXUrEIbFo.uaATZp3yOaFA0Z/PPgUfoFKLmDHkM0ae', '2025-01-29 15:09:33', NULL),
(4, 'Benani', 'Manal', 'benani@gmail.com', '0617234567', 'langage c', 'permanent', '/uploads/1738361799531-profil5.jpg', '$2b$10$YBQGdd.YJ1UqP/EZPAy7UOloMEoNwQKpqHQ.6EjVZuERmJ9wSL9Vu', '2025-01-31 14:32:49', NULL),
(5, 'Dupont', 'Jean', 'jean.dupont@example.com', '0601020304', 'Mathématiques', 'permanent', '', '$2b$10$BWABZlhXEC9Uv/E14FWP6.tYzGl9ig.kJiiGVv0xyimJ6QCftOns.', '2025-01-31 21:36:57', NULL),
(6, 'Martin', 'Sophie', 'sophie.martin@example.com', '0611121314', 'Physique', 'vacataire', '', '$2b$10$gAM1uVMDJUAFmBNOAenh1O6lGdNq/KfGSRLhEwi4Y/cptoaqwUdBC', '2025-01-31 21:36:57', NULL),
(7, 'Bernard', 'Luc', 'luc.bernard@example.com', '0622233344', 'Informatique', 'permanent', '', '$2b$10$teHNINP.G8uxvPjBaEHrVu9GpHik8CZr3NqJ.lovUaE2Iw9ph9tK.', '2025-01-31 21:36:57', NULL),
(8, 'Robert', 'Marie', 'marie.robert@example.com', '0633344556', 'Chimie', 'vacataire', '', '$2b$10$Bf/2BU.NU2y2S2EfpCIAqO5oP/HWPN8taz1HS2fPiMpHitDEXwW0S', '2025-01-31 21:36:57', NULL),
(9, 'Durand', 'Paul', 'paul.durand@example.com', '0644455667', 'Biologie', 'permanent', '', '$2b$10$JA1EMEEIsUIdEQsIjH7C.uuOuABJfyiixgsTTRSHgG924rbFboq0O', '2025-01-31 21:36:57', NULL),
(10, 'Sallemi', 'Fahd', 'sallemi@gmail.com', '0678452312', 'JAVA', 'permanent', '/uploads/1738574264146-profil12.jpg', '$2b$10$CmUCQ0UdgD2RoNw89Q4NZO3WofPwViOWaym9MSD4QAilRgSSdtG.u', '2025-02-03 09:16:18', NULL),
(11, 'Chahmi', 'Nouha', 'chahminouhaila4@gmail.com', '0609305021', 'WEB', 'vacataire', '1738658021485-profil4.jpg', '$2b$10$yUBzfHnV.gAFcxfU9pgk/eQ5oaYcxpdkN5n8ECOZm1pBCst3i79gG', '2025-02-04 08:33:41', NULL),
(12, 'lalaa', 'jjj', 'lalaa@gmail.com', '0987653456', 'JEE', 'permanent', '/uploads/1739359423350-profil6.jpg', '$2b$10$raUeaKTq7.vVGoBxttpE3e8p9qJP6a/PkwsOxxl2fxRb6dS7H4Nn2', '2025-02-12 11:21:08', NULL),
(13, 'hhh', 'kk', 'kk@gmail.com', '1234567891', 'll', 'permanent', '1739362739027-profil8.jpg', '$2b$10$W/pha.C4scaELgxMnh2XxOWM/zrpP0yt35HKpoJUqUhOdh1OU8QG2', '2025-02-12 12:18:59', NULL),
(14, 'gg', 'gg', 'gg@gmail.com', '1234567891', 'gg', 'permanent', '/uploads/1739370255695-profil11.jpg', '$2b$10$jdkPONsLZI.qzrbpapN7ZuneBn/be7m4.q8StDFwTYEr1Z0tN2Jwy', '2025-02-12 14:24:15', NULL),
(15, 'llq', 'mqmq;', 'kab@gmail.com', '', 'JAVA', 'permanent', '/uploads/1739719588242-profil1.jpg', '$2b$10$XW28g.DcushqC5CFdM1FQOoAEkcf./6TwEaB5suj7qpFq7YUOeLPm', '2025-02-16 15:26:28', NULL),
(16, 'mkk', 'kma', 'benani1@gmail.com', '09876543456789', 'langage c', 'vacataire', NULL, '$2b$10$W4.l9Lrnrls7cTAQrgo7X.7n5tRHe51JE6F.4rtv2I5R75bEnMOgq', '2025-02-16 20:53:09', NULL),
(17, 'taa', 'aa', 'kaba@gmail.com', '2325855858', 'programmation oriente objet (java)', 'permanent', NULL, '$2b$10$d6VkKRtwxlgPsfx.FI/0Denkx1ulqf/.2BMUf6NbE4TzO9k9WYoaa', '2025-02-17 08:14:17', NULL),
(18, 'dip', 'Pierre', 'pie1e.dupont@mail.com', '', '', 'permanent', '', '$2b$10$A2HLEQ9vXd43XhOz4jlrQ.zwvAJBzwb8Qp7I2AmAUphfmxRhSpG4.', '2025-02-17 12:53:35', NULL),
(19, 'Martin', 'Sophie', 'sohie.m12artin@mail.com', '', '', 'vacataire', '', '$2b$10$NKK9J3wBduzmakMJQJvVvuBCf0ryNYWzJM9cwhUjznR54l5aDz0sC', '2025-02-17 12:53:35', NULL),
(20, 'Lefevre', 'Claire', 'clare.1lefevre@mail.com', '', '', 'permanent', '', '$2b$10$nk.CgBSqJECeCjR38KExM.CB5dqByVhtwJYecy43.TAhQxaWC57nC', '2025-02-17 12:53:35', NULL),
(21, 'Durand', 'Jean', 'jen.d15urand@mail.com', '', '', 'vacataire', '', '$2b$10$slAv8fkuPxtHKXvewifNvOl9mqa2..stOuzEG1y9NcXYoHQtCKX5O', '2025-02-17 12:53:35', NULL),
(22, 'Bernard', 'jalil', 'hhhh.12comme@mail.com', '', '', 'permanent', '', '$2b$10$MknNQLcD1j0C9rGJqta0Uek1dOrF9YMDrp7QRqCPSvjmYEgM2QVM2', '2025-02-17 12:53:35', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `professeurs`
--
ALTER TABLE `professeurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `professeurs`
--
ALTER TABLE `professeurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE `T001EmployeeDetail` (
  `employeeNo` varchar(6) COLLATE utf8mb3_bin NOT NULL,
  `employeeFormCode` int DEFAULT NULL,

  `password` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `japaneseCalendar` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,

  `employeeFirstName` varchar(8) COLLATE utf8mb3_bin NOT NULL,
  `employeeLastName` varchar(8) COLLATE utf8mb3_bin NOT NULL,
  `furigana` varchar(65) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `alphabetName` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `genderStatus` varchar(1) COLLATE utf8mb3_bin DEFAULT NULL,
  `birthday` varchar(10) COLLATE utf8mb3_bin DEFAULT NULL,
  `nationalityCode` int DEFAULT NULL,
  `brithplace` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,

  `companyMail` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `phoneNo` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `postalCode` int DEFAULT NULL,
  `firstHalfAddress` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,
  `lastHalfAddress` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,
  `stationCode` int DEFAULT NULL,

  `picInfo` longblob,

  `authorityCode` int NOT NULL,
  `graduationUniversity` varchar(20) COLLATE utf8mb3_bin DEFAULT NULL,
  `graduationYearAndMonth` varchar(6) COLLATE utf8mb3_bin DEFAULT NULL,
  `comeToJapanYearAndMonth` varchar(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `intoCompanyYearAndMonth` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `yearsOfExperience` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,

  `homesAgentCode` int DEFAULT NULL,
  `departmentCode` int DEFAULT NULL,
  `residenceCode` int DEFAULT NULL,
  `employmentInsuranceStatus` varchar(1) COLLATE utf8mb3_bin DEFAULT NULL,
  `socialInsuranceStatus` varchar(1) COLLATE utf8mb3_bin DEFAULT NULL,
  `retirementYearAndMonth` varchar(8) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  
  `employmentInsuranceNo` varchar(13) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `socialInsuranceNo` varchar(13) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `retirementResonClassificationCode` int DEFAULT NULL,
  
  `updateTime` datetime DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateUser` varchar(45) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`employeeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin
USE censusdat;
-- Populate income_meta_lut
INSERT INTO income_meta_lut (id, display_value)
VALUES (1, 'Total income'),
(2, 'Market income'),
(3, 'Employment income'),
(4, 'Wages, salaries and commissions'),
(5, 'Net self-employment income'),
(6, 'Investment income'),
(7, 'Private retirement income'),
(8, 'Market income not included elsewhere'),
(9, 'Government transfers'),
(10, 'Old Age Security pension (OAS) and Guaranteed Income Supplement (GIS)'),
(11, 'Canada Pension Plan (CPP) and Québec Pension Plan (QPP) benefits'),
(12, 'Employment Insurance (EI) benefits'),
(13, 'Child benefits'),
(14, 'Other government transfers'),
(15, 'After-tax income'),
(16, 'Income taxes')
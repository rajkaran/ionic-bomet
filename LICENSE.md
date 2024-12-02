SELECT *
FROM Articles
WHERE NoArticle = '500'

SELECT *
FROM Departement
where ID = 104;

SELECT *
FROM Articles
where Articles.Departement = 'Enviro';

SELECT *
FROM Articles
where Articles.Departement = 'Bev';

SELECT *
FROM Articles
WHERE Articles.ArticleLie = '501';

Bev - beverage
Bev Nd - beverage Non discountable


NoArticle
500
501
502
503
504
505
506
507
508
509
510
511
530
531
532


beverages

SELECT a.*, env.NoArticle as envNoArticle, env.Description as envDescription, env.PrixVente as envPrixVente
FROM Articles as a
LEFT JOIN Articles as env on env.NoArticle = a.ArticleLie
LEFT JOIN PrixSpeciaux ps on ps.Article = a.Article
;

SELECT a.*, ps.Article as specialArticle, ps.Debut as specialDebut, ps.Fin as specialFin, ps.Prix as specialPrix, 
env.NoArticle as envNoArticle, env.Description as envDescription, env.PrixVente as envPrixVente
FROM (Articles as a LEFT JOIN (SELECT * FROM PrixSpeciaux WHERE Actif = true) ps on ps.Article = a.NoArticle)
LEFT JOIN Articles as env on env.NoArticle = a.ArticleLie
;

SELECT a.*, ps.Article as specialArticle, ps.Debut as specialDebut, ps.Fin as specialFin, ps.Prix as specialPrix, 
env.NoArticle as envNoArticle, env.Description as envDescription, env.PrixVente as envPrixVente
FROM (Articles as a LEFT JOIN (SELECT * FROM PrixSpeciaux WHERE Actif = true) ps on ps.Article = a.NoArticle)
LEFT JOIN Articles as env on env.NoArticle = a.ArticleLie
WHERE a.NoArticle = '627765036091' or UCase(a.NoFournisseur) = 'OFC-100767-BUL'
;

OFC-100767-BUL

SELECT *
FROM Articles
where Articles.Article = '627765036091' or Articles.NoArticle = '627765036091'
;

SELECT 
FROM PrixSpeciaux, PrixSpeciaux AS PrixSpeciaux_1;

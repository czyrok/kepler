## Changelog

# Début du développement
* 27 mars 2020

# 1.0.0
* implémentation de la webview

# 1.0.1
* implémentation de la barre contenant le bouton pour fermer l'application

# 1.0.2
* changement du code css et js de la barre

# 1.0.3
* résolution de bugs liés à la barre

# 1.0.4
* ajout de la radio

# 1.0.5
* résolution de bugs liés à la radio

# 1.0.6
* modification de la structure de l'application

# 1.0.7
* ajout de l'onglet note et du slider permettant de changer le volume de la radio

# 1.0.8
* résolution de bugs liés à la radio et à l'onglet note

# 1.0.9
* résolution de bugs liés à la radio

# 1.0.10
* ajout de boutons back, forward et refresh (pour controler la webview)
* réorganisation js
* ajout du button_disabled.js

# 1.0.11
* modification de l'onglet note, du menu et du volume slider
* ajout d'aria-label

# 1.0.12
* ajout du discord-rpc

# 1.0.13
* modification du menu, de l'onglet note et du slider volume, ça change directement l'id du bouton au lieu de le remplacer par un autre

# 1.0.14
* modification des valeurs, exemple note_visibility -> noteVisibility

# 1.0.15
* modification du bouton refresh, ajout d'une animation

# 1.0.16
* ajout de la désactivation du menu pendant le chargement de la webview

# 1.0.17
* ajout d'un mode hors connexion avec l'affichage du bouton refresh directement dans le frame
* ajout d'une fonctionnalité qui garde en mémoire la taille de la fenêtre

# 1.0.18
* résolution du bug de fermeture de l'application
* résolution du bug au lancement de l'application de l'erreur jsonparse()

# 1.0.19
* résolution du bug au lancement de l'application de l'erreur jsonparse() qui était encore présent
* modification du fichier json
* modification des conditions du passage en mode offline
* ajout d'un preload pour la webview du site

# 1.0.20
* résolution du bug qui enregistrait la dimension de la fenetre même si elle était en maximize ou en fullscreen

# 1.0.21
* résolution du soucis de conflit si deux fenêtre était ouverte + modification du code des alerts jaune et rouge

# 1.0.22
* ajout d'une alerte, l'alerte bleu et du bouton pin permettant que laisser la fenêtre au premier plan

# 1.0.23
* ajout d'un bouton permettant d'accéder au site qu'il a pour url la valeur default du data.json
* les boutons pour ouvrir un nouvel onglet fonctionnent et l'url est chargé directement dans la webview

# 1.0.24
* remplacement du bouton url par le bouton home
* mode offline supprimé
* ajout de la barre de recherche
* ajout de l'enregistrement des menus ouverts

# 1.0.25
* changement icone fullscreen
* modification des menus "note", "menu", "slider_volume", "search_bar"

# 1.0.26
* ajout de la suppression de l'historique lors du lancement de l'app
* scroll bar customisé de retour seulement dans l'onglet note
* la taille de l'onglet note a été réduit
* bouton de recherche déplacé à gauche du bouton pencil
* placeholder de l'onglet note changé
* ajout du responsive

# 1.0.27
* suppression onglet note
* bug menu résolu
* ajout de la page d'accueil

# 1.0.28
* suppression de flash player
* suppression du discord rpc
* modification interface
* bug réglé au niveau du responsive
* mode fullscreen modifié

# 1.0.29
* ajout d'un croix pour chaque alerte
* ajout d'un raccourci global pour ouvrir une nouvelle fenêtre

# 1.1.0
* ajout de la fonctionnalité permettant d'ouvrir un lien dans une nouvelle fenêtre
* ajout d'une fonctionnalité permettant l'utilisation des raccourcis dans la webview
* ajout de la page paramètre dans l'application (avec changement de la langue, du moteur de recherche et de la taille de la fenêtre au lancement)

# 1.1.1
* ajout d'un bouton pour accéder aux paramètres depuis la page d'accueil
* modification de la taille minimum de la fenêtre
* résolution du bug du ctrl + clique
* résolution du bug du plein écran
* ajout d'une fonctionnalité, si le plein écran est activé, le rapprochement du curseur vers le haut de l'écran affiche le cadre
* modification des raccourcis
* modification de la page de paramètres
* modification du comportement de la l'application lors du ctrl + n

# 1.1.2
* résolution du bug de la barre de recherche
* ajout d'un bouton pour ouvrir une nouvelle fenêtre
* modification de nom d'ids et de catégories dans le code
* ajout du mode sombre à la page d'accueil et à la page de paramètres
* suppression du loader
* modification du système d'enregistrement des données, maintenant c'est le processus principal qui gère tout
* ajout de nouvelles radios
* modification du lancement de l'application avec la création en direct d'une webview
* modification du responsive
* ajout des onglets + modification de l'interface
* ajout du système de ctrl tab et le menu qui va avec
* ajout d'un système qui affiche le titre de l'onglet ouvert dans la barre des taches

# 1.1.3
* résolution du bug qui empêchait d'accéder à certain site en enlevant une fonctionnalité, celle qui permettait d'afficher le frame quand on était en plein écran et qu'on mettait la souris proche du haut de l'écran
* résolution du bug qui ouvrait une fenêtre quand on se déconnectait de mega.nz
* ajout du raccourci pour copier l'url de l'onglet
* modification des couleurs du navigateur
* modification de certains icones et bannières
* résolution du bug qui ne mettait pas à jour quand on utilisait le drag and drop ou quand on ouvrait un fichier avec le navigateur
* ajout de la fonctionnalité permettant d'ouvrir des images et des fichiers txt avec le navigateur
* ajout du raccourci CTRL + H pour afficher la page d'accueil dans l'onglet actif
* retour du mode hors connexion

# 1.1.4
* ajout de la fonctionnalité permettant de déplacer les onglets (dragula)
* résolution du bug avec le titre du nouvel onglet qui ne s'actualisait pas
* modification du système qui vérifie les URLs
* ajout d'une alerte lorsque le site est inaccessible
* résolution du bug avec l'input invisible pour le raccourci CTRL + L
* changement de place du bouton nouvel onglet
* ajout d'une alerte lorsque les paramètres sont réinitialisés
* modification du système de détection de la connexion à internet
* ajout du raccourci CTRL + F qui permet d'ouvre lien de l'onglet actif dans une nouvelle fenêtre

# 1.1.5
* ajout des menus contextuels
* ajout des favoris

# 1.1.6
* ajout de la fenêtre de la radio et du discord-rpc
* les menus des favoris peuvent maintenant être réduits en cliquant dessus
* modification de l'interface
* résolution des bugs liés au contextmenu
* modification du dossier où sont enregistrés les paramètres
* résolution de nombreux bugs

# 1.2.0
* résolution de bugs
* ajout d'une fonctionnalité permettant la lecture de PDF
* ajout de la barre de progression de chargement et du bouton pour arrêter le chargement de l'onglet
* ajout du raccourci CTRL + G qui ferme toutes les fenêtres sauf celle où vous êtes (la fenêtre de la radio n'est pas impactée)
* ajout d'une fonctionnalité (un bouton s'affichera quand un onglet produira du son) et du raccourci CTRL + M, les deux permettant de muter l'onglet
* changement de raccourci pour ouvrir les paramètres, ce n'est plus CTRL + S mais CTRL + , et vous pouvez maintenant les ouvrir en faisant un clique droit n'importe où
* ajout des onglets privés ainsi que du raccourci pour en ouvrir un: CTRL + SHIFT + T
* désormais lorsque vous ouvrez un lien dans un nouvel onglet, cet onglet va s'ouvrir à côté de l'onglet où vous avez effectué l'action
* ajout de la page des téléchargements
* ajout du raccourci CTRL + S permettant de prendre une capture d'écran et de son contextmenu
* remplacement du bouton permettant d'ouvrir un nouvel onglet par un contextmenu
* modication de certains fichiers css et html
* ajout d'un bloqueur de publicité
* déplacement du contenu du fichier app.js dans app.ts
* les alertes s'enlèvent toutes seules désormais du coup les croix ont été retirées (mais vous pouvez toujours cliquer dessus pour l'enlever)
* ajout d'un système de mise à jour
* modification du ctrl tab menu, accessible avec le raccourci CTRL + TAB

# 1.2.1
* résolution de bugs
* ajout d'une fonctionnalité permettant de sauvegarder ce qu'on écrit dans la barre de recherche
* modification de la radio: l'image de la musique s'agrandit quand on met play
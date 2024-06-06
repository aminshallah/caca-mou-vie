import pandas as pd
import nltk
from rake_nltk import Rake
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

data = {
    "Titre": [
        "Inception", "The Matrix", "Parasite", "The Godfather", "Pulp Fiction",
        "The Dark Knight", "Fight Club", "Forrest Gump", "The Shawshank Redemption", "The Lord of the Rings: The Fellowship of the Ring",
        "The Social Network", "Gladiator", "Titanic", "Avatar", "The Lion King",
        "Interstellar", "The Avengers", "Joker", "Black Panther", "Inglourious Basterds",
        "Django Unchained", "Mad Max: Fury Road", "La La Land", "Whiplash", "The Grand Budapest Hotel"
    ],
    "Acteurs": [
        ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        ["Marlon Brando", "Al Pacino", "James Caan"],
        ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
        ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
        ["Tom Hanks", "Robin Wright", "Gary Sinise"],
        ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
        ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
        ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
        ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
        ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
        ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
        ["Matthew Broderick", "James Earl Jones", "Jeremy Irons"],
        ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
        ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"],
        ["Brad Pitt", "Diane Kruger", "Christoph Waltz"],
        ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
        ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
        ["Ryan Gosling", "Emma Stone", "John Legend"],
        ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
        ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"]
    ],
    "Réalisateurs": [
        ["Christopher Nolan"], ["The Wachowskis"], ["Bong Joon-ho"], ["Francis Ford Coppola"], ["Quentin Tarantino"],
        ["Christopher Nolan"], ["David Fincher"], ["Robert Zemeckis"], ["Frank Darabont"], ["Peter Jackson"],
        ["David Fincher"], ["Ridley Scott"], ["James Cameron"], ["James Cameron"], ["Roger Allers"],
        ["Christopher Nolan"], ["Joss Whedon"], ["Todd Phillips"], ["Ryan Coogler"], ["Quentin Tarantino"],
        ["Quentin Tarantino"], ["George Miller"], ["Damien Chazelle"], ["Damien Chazelle"], ["Wes Anderson"]

    ],
    "Genres": [
        ["Science-Fiction", "Action", "Thriller"], ["Science-Fiction", "Action"], ["Thriller", "Drame"], ["Crime", "Drame"], ["Crime", "Drame", "Comédie"],
        ["Action", "Crime", "Drame"], ["Drama", "Thriller"], ["Drame", "Romance"], ["Drame"], ["Fantasy", "Aventure"],
        ["Biographie", "Drame"], ["Action", "Aventure", "Drame"], ["Drame", "Romance"], ["Science-Fiction", "Aventure"], ["Animation", "Aventure"],
        ["Science-Fiction", "Aventure"], ["Action", "Aventure"], ["Drame", "Thriller"], ["Action", "Aventure"], ["Aventure", "Drame", "Guerre"],
        ["Drame", "Western"], ["Action", "Aventure", "Science-Fiction"], ["Comédie", "Drame", "Musical"], ["Drame", "Musical"], ["Comédie", "Drame"]
    ],
    "Synopsis": [
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "A meek hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        "Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, but is later sued by two brothers who claimed he stole their idea.",
        "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
        "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
        "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
        "In Gotham's fractured society, mentally troubled comedian Arthur Fleck embarks on a downward spiral of social revolution and bloody crime.",
        "T'Challa, the King of Wakanda, rises to the throne in the isolated, technologically advanced African nation, but his claim is challenged by a vengeful outsider.",
        "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.",
        "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
        "In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiosa, to try and survive.",
        "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
        "A writer encounters an enchanting hotel concierge who is his only ally as the hotel's fantastical history is slowly revealed."
    ]
}

# Convertir en DataFrame
df = pd.DataFrame(data)

# Formater les acteurs et les genres
df['Acteurs'] = df['Acteurs'].map(lambda x: [actor.lower().replace(' ', '') for actor in x])

# Formater les genres en liste de mots en minuscules
df['Genres'] = df['Genres'].map(lambda x: [genre.lower().replace('-','').replace(' ', '') for genre in x])

# Formater les réalisateurs
df['Réalisateurs'] = df['Réalisateurs'].map(lambda x: [réalisateur.lower().replace(' ', '') for réalisateur in x])

# Formater les réalisateurs
df['Synopsis'] = df['Synopsis'].map(lambda x: x.lower())

# Initialisation de la nouvelle colonne
df['Key_words'] = ""

# Itération sur chaque ligne du DataFrame
for index, row in df.iterrows():
    syn = row['Synopsis']
    
    # Instanciation de Rake
    r = Rake()

    # Extraction des mots clés à partir du texte
    r.extract_keywords_from_text(syn)

    # Obtention du dictionnaire de mots clés avec leurs scores
    key_words_dict_scores = r.get_word_degrees()
    
    # Assignation des mots clés à la nouvelle colonne
    df.at[index, 'Key_words'] = list(key_words_dict_scores.keys())



# Exemples de données avec des notes de l'utilisateur
""" ratings = {
    'Titre': ['Inception', 'The Godfather', 'The Dark Knight'],
    'Rating': [5, 4, 5]
} """

""" ratings = {
    'Titre': ['Pulp Fiction', 'The Shawshank Redemption', 'The Matrix', 'The Lion King', 'Interstellar'],
    'Rating': [5, 4, 5, 1, 4]
} """

ratings = {
    'Titre': ['Inception','The Social Network'],
    'Rating': [5,1]
}


print(ratings)

ratings_df = pd.DataFrame(ratings)

# Fusionner les notes avec le DataFrame des films
merged_df = pd.merge(df, ratings_df, on='Titre', how='left')

# Remplir les valeurs manquantes avec 0 (pour les films non notés)
merged_df['Rating'].fillna(0)

# Créer le profil utilisateur en pondérant les réalisateurs, les acteurs, les genres et les mots clés par les notes
def create_user_profile(merged_df):
    user_profile = {}
    for index, row in merged_df.iterrows():
        if row['Rating'] >0 :
            for acteur in row['Acteurs']:
                if acteur in user_profile:
                    user_profile[acteur] += row['Rating']
                else:
                    user_profile[acteur] = row['Rating']
            for réal in row['Réalisateurs']:
                if réal in user_profile:
                    user_profile[réal] += row['Rating']
                else:
                    user_profile[réal] = row['Rating']
            for genre in row['Genres']:
                if genre in user_profile:
                    user_profile[genre] += row['Rating']*2
                else:
                    user_profile[genre] = row['Rating']*2
            """ for keyword in row['Key_words']:
                if keyword in user_profile:
                    user_profile[keyword] += row['Rating']
                else:
                    user_profile[keyword] = row['Rating'] """
    return user_profile

user_profile = create_user_profile(merged_df)


# Normaliser le profil de l'utilisateur
max_rating = max(user_profile.values())

user_profile = {k: v / max_rating for k, v in user_profile.items()}

""" print(user_profile) """

# Créer un vecteur TF-IDF
def combine(row):
    genres = ' '.join(row['Genres'])
    acteurs = ' '.join(row['Acteurs'])
    réalisateurs = ' '.join(row['Réalisateurs'])
    """ keywords = ' '.join(row['Key_words']) """
    return genres + ' ' + acteurs + ' ' + réalisateurs
""" + ' ' + keywords """

merged_df['features'] = merged_df.apply(combine, axis=1)

""" print(merged_df) """

tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(merged_df['features'])

""" print(tfidf_matrix) """

# Créer un vecteur pour le profil de l'utilisateur
user_profile_vector = np.array([user_profile.get(term, 0) for term in tfidf.get_feature_names_out()]).reshape(1, -1)

""" print(user_profile_vector) """

# Calculer la similarité cosinus entre le profil de l'utilisateur et les films
similarity_scores = cosine_similarity(user_profile_vector, tfidf_matrix)

# Ajouter les scores de similarité au DataFrame
merged_df['Similarity'] = similarity_scores.flatten()

# avec les films déjà notés en bas
merged_df['AlreadyRated'] = merged_df['Rating'] > 0
recommended_movies = merged_df.sort_values(by=['AlreadyRated', 'Similarity'], ascending=[True, False])

# Afficher les films recommandés
print(recommended_movies)
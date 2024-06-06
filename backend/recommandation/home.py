import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sqlalchemy import create_engine


def recommendations():
    DATABASE_URI = f'sqlite:////Users/defos/OneDrive/Bureau/EIWebData/caca-mou-vie/backend/database.sqlite3'

    # Création du moteur SQLAlchemy
    engine = create_engine(DATABASE_URI)
    # Requêtes SQL pour récupérer les données sur les films et les notes d'un utilisateur
    query_movie = "SELECT id, mainActors, director, genre FROM movie"
    """ query_note = "SELECT filmId, note FROM note" """
    # Chargement des données dans un DataFrame Pandas
    df = pd.read_sql(query_movie, engine)
    """ note_df = pd.read_sql(query_note, engine) """
    note_df = pd.DataFrame({'filmId':[1,2],'note':[3,5]})
    note_df.rename(columns={'filmId': 'id'}, inplace=True)

    df = pd.merge(df, note_df, on='id', how='left')

    # Remplir les valeurs manquantes avec 0 (pour les films non notés)
    df['note'].fillna(0)

    # Formatage
    df['mainActors'] = df['mainActors'].map(lambda x: x.split(", "))
    df['mainActors'] = df['mainActors'].map(lambda x: [actor.lower().replace(' ', '') for actor in x])
    df['genre'] = df['genre'].map(lambda x: x.split(", "))
    df['genre'] = df['genre'].map(lambda x: [genre.lower().replace('-','').replace(' ', '') for genre in x])
    df['director'] = df['director'].map(lambda x: x.lower().replace(' ', ''))

    # Création du profil utilisateur en pondérant les genres
    user_profile = {}
    for index, row in df.iterrows():
        if row['note'] >0 :
            for acteur in row['mainActors']:
                if acteur in user_profile:
                    user_profile[acteur] += row['note']
                else:
                    user_profile[acteur] = row['note']
            for réal in row['director']:
                if réal in user_profile:
                    user_profile[réal] += row['note']
                else:
                    user_profile[réal] = row['note']
            for genre in row['genre']:
                if genre in user_profile:
                    user_profile[genre] += row['note']*2
                else:
                    user_profile[genre] = row['note']*2
    
    # Normaliser le profil de l'utilisateur
    max_note = max(user_profile.values())

    user_profile = {k: v / max_note for k, v in user_profile.items()}

    # Créer un vecteur TF-IDF
    def combine(row):
        genres = ' '.join(row['genre'])
        mainActors = ' '.join(row['mainActors'])
        director = ' '.join(row['director'])
        return genres + ' ' + mainActors + ' ' + director

    df['features'] = df.apply(combine, axis=1)
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(df['features'])

    # Créer un vecteur pour le profil de l'utilisateur
    user_profile_vector = np.array([user_profile.get(term, 0) for term in tfidf.get_feature_names_out()]).reshape(1, -1)

    # Calculer la similarité cosinus entre le profil de l'utilisateur et les films
    similarity_scores = cosine_similarity(user_profile_vector, tfidf_matrix)

    # Ajouter les scores de similarité au DataFrame
    df['Similarity'] = similarity_scores.flatten()

    # avec les films déjà notés en bas
    df['AlreadyRated'] = df['note'] > 0
    recommended_movies = df.sort_values(by=['AlreadyRated', 'Similarity'], ascending=[True, False])

    return recommended_movies['id'].tolist()

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sqlalchemy import create_engine
import sys
import json

def recommendations(userId):
    DATABASE_URI = f'sqlite:////home/amin/cs/1a/s6/webdata/caca-mou-vie/backend/database.sqlite3'


    engine = create_engine(DATABASE_URI)

    query_movie = "SELECT id, mainActors, director, genre FROM movie"
    query_note = "SELECT filmId, note FROM note WHERE userId=" + str(userId) 

    df = pd.read_sql(query_movie, engine)
    note_df = pd.read_sql(query_note, engine)

    note_df.rename(columns={'filmId': 'id'}, inplace=True)

    df = pd.merge(df, note_df, on='id', how='left')



    df['note'].fillna(0)

    
    df['mainActors'] = df['mainActors'].map(lambda x: x.split(", "))
    df['mainActors'] = df['mainActors'].map(lambda x: [actor.lower().replace(' ', '') for actor in x])
    df['genre'] = df['genre'].map(lambda x: x.split(", "))
    df['genre'] = df['genre'].map(lambda x: [genre.lower().replace('-','').replace(' ', '') for genre in x])
    df['director'] = df['director'].map(lambda x: x.lower().replace(' ', ''))


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
    

    max_note = max(user_profile.values())

    user_profile = {k: v / max_note for k, v in user_profile.items()}


    def combine(row):
        genres = ' '.join(row['genre'])
        mainActors = ' '.join(row['mainActors'])
        director = ' '.join(row['director'])
        return genres + ' ' + mainActors + ' ' + director

    df['features'] = df.apply(combine, axis=1)
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(df['features'])

    user_profile_vector = np.array([user_profile.get(term, 0) for term in tfidf.get_feature_names_out()]).reshape(1, -1)


    similarity_scores = cosine_similarity(user_profile_vector, tfidf_matrix)

    df['Similarity'] = similarity_scores.flatten()

    df['AlreadyRated'] = df['note'] > 0
    recommended_movies = df.sort_values(by=['AlreadyRated', 'Similarity'], ascending=[True, False])

    return (recommended_movies['id'].tolist())[:7]

if __name__ == "__main__":
    userId = sys.argv[1]
    recs = recommendations(1)
    print(json.dumps(recs))

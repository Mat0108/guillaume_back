
db = db.getSiblingDB('guillaume'); // crée/accède à la base "guillaume"

db.createUser({
  user: 'admin',
  pwd: 'F8G3iKGT@8cASsGy',
  roles: [
    { role: 'readWrite', db: 'guillaume' }
  ]
});

print('✅ Utilisateur admin créé sur la base guillaume');

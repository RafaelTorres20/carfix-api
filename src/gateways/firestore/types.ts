export type FirestoreResponseGet = FirebaseFirestore.DocumentSnapshot<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

export type FirestoreResponseUpdate = FirebaseFirestore.WriteResult;

export type FirestoreResponseCreate = FirebaseFirestore.DocumentReference<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

export type FirebaseResponseFindAll = FirebaseFirestore.QuerySnapshot<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

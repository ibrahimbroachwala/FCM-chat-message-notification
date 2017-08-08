
//mChatuser is the one who receives the notification
mRootref.child("Users").child(mChatuser).child("online").addListenerForSingleValueEvent(new ValueEventListener() {
                            @Override
                            public void onDataChange(DataSnapshot dataSnapshot) {
                                String online = dataSnapshot.getValue().toString();

				//Send notification only if the user is not online
				
                                if(!online.equals("true")){

                                    Map notimap = new HashMap();
                                    notimap.put("from",Uid);
                                    notimap.put("type","message");
                                    notimap.put("message",message);

                                    mRootref.child("MessageNoti").child(mChatuser).push().setValue(notimap)
                                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                @Override
                                                public void onSuccess(Void aVoid) {
                                                }
                                            });
                                }
                            }

                            @Override
                            public void onCancelled(DatabaseError databaseError) {

                            }
                        });
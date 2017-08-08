

//Add this code in then OnClickListener of your send message button. 

//mChatuser is the one who receives the notification
mRootref.child("Users").child(mChatuser).child("online").addListenerForSingleValueEvent(new ValueEventListener() {
                            @Override
                            public void onDataChange(DataSnapshot dataSnapshot) {
                                String online = dataSnapshot.getValue().toString();

				//Send notification only if the user is not online
				
                                if(!online.equals("true")){


				//Uid is the id of current logged in user sending the message

                                    Map notimap = new HashMap();
                                    notimap.put("from",Uid);
                                    notimap.put("type","message");
                                    notimap.put("message",message);
					
				//Message is uploaded to child "MessageNoti" of which we set a onwrite trigger function in JS.

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

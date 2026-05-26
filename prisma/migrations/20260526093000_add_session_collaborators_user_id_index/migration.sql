-- CreateIndex
CREATE INDEX "session_collaborators_user_id_session_id_idx"
ON "session_collaborators"("user_id", "session_id");

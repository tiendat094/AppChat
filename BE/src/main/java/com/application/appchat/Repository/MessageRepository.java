package com.application.appchat.Repository;

import com.application.appchat.Entity.Message;
import com.application.appchat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
   Message findById(long id);
   @Query("SELECT m FROM Message m WHERE m.group.id=:groupId ORDER BY m.createdDate ASC")
   List<Message> findByGroup_Id(@Param("groupId") Long groupId);

   @Query("SELECT m FROM Message m WHERE (m.content LIKE %:search%) AND (m.group.id = :groupId)")
   List<Message> searchMessage(@Param("search") String search, @Param("groupId") long groupId);
}

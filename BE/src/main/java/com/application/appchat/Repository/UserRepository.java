package com.application.appchat.Repository;

import com.application.appchat.Entity.Group;
import com.application.appchat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository   extends JpaRepository<User,Long> {
    User findByUserName(String userName);
    User findById(long id);
    @Query("SELECT u FROM User u where u.userName LIKE %:search% or u.email like %:search%")
    List<User> findBySearch(@Param("search") String search);

//    @Query(value = "SELECT g.* FROM groups g WHERE g.id IN ( SELECT ug.group_id FROM user_group ug WHERE ug.user_id =: userId)", nativeQuery = true)
//    List<Group> getGroupsForUser(@Param("userId") Long userId);

    @Query("SELECT g FROM Group g JOIN g.users u WHERE u.id = :userId ORDER BY g.lastMessageDate DESC")
    List<Group> getGroupsForUser(@Param("userId") Long userId);


    User findByEmail(String email);
}














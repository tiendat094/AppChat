package com.application.appchat.Repository;

import com.application.appchat.Entity.Group;
import com.application.appchat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group,Long> {
   Group findByNameGroup(String nameGroup);
   Group findById(long id);

   @Query("SELECT u FROM Group u where LOWER(u.nameGroup) LIKE LOWER(CONCAT('%', :search, '%'))")
   List<Group> findBySearchNameGroup(@Param("search") String search);

   @Query("SELECT u FROM User u JOIN u.groups g WHERE g.id = :groupId")
   List<User> getUserForGroup(@Param("groupId") Long groupId);

   @Query("SELECT u from Group u where u.nameGroup LIKE %:name1% and u.nameGroup LIKE %:name2% ")
   Group findByFriend(@Param("name1") String name1, @Param("name2") String name2);
}

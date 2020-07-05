package com.beanz.censusviz.repos

import com.beanz.censusviz.records.DUserProfile
import org.springframework.data.repository.CrudRepository

interface UserProfileRepo : CrudRepository<DUserProfile, Int> {
}
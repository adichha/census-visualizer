package com.beanz.censusviz.repos

import com.beanz.censusviz.records.DLoginToken
import org.springframework.data.repository.CrudRepository

interface LoginTokenRepo: CrudRepository<DLoginToken, String> {

    fun deleteAllByUsername(username: String): Int

}
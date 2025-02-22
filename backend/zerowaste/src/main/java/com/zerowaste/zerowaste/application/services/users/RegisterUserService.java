package com.zerowaste.zerowaste.application.services.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zerowaste.zerowaste.application.interfaces.UsersRepository;
import com.zerowaste.zerowaste.application.services.users.exceptions.UserWithSameEmailAlreadyExistsException;

@Service
public class RegisterUserService {
    @Autowired
    private UsersRepository usersRepository;

    public void execute(RegisterUserServiceDto dto) throws UserWithSameEmailAlreadyExistsException {
        var user = usersRepository.findByEmail(dto.email());

        if (user != null) {
            throw new UserWithSameEmailAlreadyExistsException("User with same email already exists");
        }
    }
}

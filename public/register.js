document.getElementById('username').addEventListener('input', validateUsername);
                        document.getElementById('email').addEventListener('input', validateEmail);
                        document.getElementById('password').addEventListener('input', validatePasswordPattern);
                        document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);

                        function validateUsername() {
                            const username = document.getElementById('username').value;
                            const usernamePattern = /^[a-zA-Z0-9]+$/;
                            const usernameError = document.getElementById('usernameError');
                            const usernameInput = document.getElementById('username');

                            if (usernamePattern.test(username) && !username.toLowerCase().includes('admin')) {
                                usernameInput.classList.remove('invalid');
                                usernameInput.classList.add('valid');
                                usernameError.style.display = 'none';
                                return true;
                            } else {
                                usernameInput.classList.remove('valid');
                                usernameInput.classList.add('invalid');
                                usernameError.style.display = 'block';
                                return false;
                            }
                        }

                        function validateEmail() {
                            const email = document.getElementById('email').value;
                            const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
                            const emailError = document.getElementById('emailError');
                            const emailInput = document.getElementById('email');

                            if (emailPattern.test(email)) {
                                emailInput.classList.remove('invalid');
                                emailInput.classList.add('valid');
                                emailError.style.display = 'none';
                                return true;
                            } else {
                                emailInput.classList.remove('valid');
                                emailInput.classList.add('invalid');
                                emailError.style.display = 'block';
                                return false;
                            }
                        }

                        function validateUsernameAndEmail() {
                            if (validateUsername() && validateEmail()) {
                                nextStep(2);
                            }
                        }

                        function nextStep(step) {
                            document.querySelectorAll('.step').forEach(function (stepDiv) {
                                stepDiv.classList.remove('active');
                            });

                            document.getElementById('step' + step).classList.add('active');
                        }

                        function prevStep(step) {
                            nextStep(step);
                        }

                        function validatePassword() {
                            const password = document.getElementById('password').value;
                            const passwordError = document.getElementById('passwordError');
                            const confirmPassword = document.getElementById('confirmPassword').value;
                            const specialChars = /[!@#%^*.]/;
                            const validPasswordPattern = /^[a-zA-Z0-9!@#%^*.]+$/;

                            if (password !== confirmPassword) {
                                passwordError.innerText = 'รหัสผ่านไม่ตรงกัน';
                                passwordError.style.display = 'block';
                            } else if (!specialChars.test(password)) {
                                passwordError.innerText = 'รหัสผ่านต้องมีอักขระพิเศษ !@#%^*. อย่างน้อยหนึ่งตัว'
                                passwordError.style.display = 'block';
                            } else if (!validPasswordPattern.test(password)) {
                                passwordError.innerText = 'รหัสผ่านต้องประกอบด้วย a-Z อักขระพิเศษ !@#%^*. และตัวเลขเท่านั้น';
                                passwordError.style.display = 'block';
                            } else if (password.length < 8) {
                                passwordError.innerText = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว'
                                passwordError.style.display = 'block';
                            }
                            else {
                                passwordError.style.display = 'none';
                                nextStep(3);
                            }
                        }
                        function validatePasswordMatch() {
                            const password = document.getElementById('password').value;
                            const confirmPassword = document.getElementById('confirmPassword').value;
                            const confirmPasswordInput = document.getElementById('confirmPassword');

                            if (password === confirmPassword) {
                                confirmPasswordInput.classList.remove('invalid');
                                confirmPasswordInput.classList.add('valid');
                            } else {
                                confirmPasswordInput.classList.remove('valid');
                                confirmPasswordInput.classList.add('invalid');
                            }
                        }

                        function validatePasswordPattern() {
                            const password = document.getElementById('password').value;
                            const minLength = 8;
                            const specialChars = /[!@#%^*.]/;
                            const validPasswordPattern = /^[a-zA-Z0-9!@#%^*.]+$/; // อนุญาตเฉพาะ a-Z, 0-9 และอักขระพิเศษที่กำหนด
                            const passwordInput = document.getElementById('password');
                            const passwordInput2 = document.getElementById('confirmPassword');

                            if (password.length >= minLength && specialChars.test(password) && validPasswordPattern.test(password)) {
                                passwordInput.classList.remove('invalid');
                                passwordInput.classList.add('valid');
                            } else {
                                passwordInput.classList.remove('valid');
                                passwordInput.classList.add('invalid');
                            }
                        }
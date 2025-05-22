    // Elementos DOM
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        const confirmation = document.getElementById('confirmation');
        const results = document.getElementById('results');
        const resultsButton = document.getElementById('resultsButton');
        
        const fullNameInput = document.getElementById('fullName');
        const curpInput = document.getElementById('curp');
        const fullNameError = document.getElementById('fullNameError');
        const curpError = document.getElementById('curpError');
        
        const candidateCards = document.querySelectorAll('.candidate-card');
        const confirmName = document.getElementById('confirmName');
        const confirmCurp = document.getElementById('confirmCurp');
        const confirmCandidate = document.getElementById('confirmCandidate');
        
        const nextToStep2Btn = document.getElementById('nextToStep2');
        const backToStep1Btn = document.getElementById('backToStep1');
        const nextToStep3Btn = document.getElementById('nextToStep3');
        const backToStep2Btn = document.getElementById('backToStep2');
        const submitVoteBtn = document.getElementById('submitVote');
        const backToStartBtn = document.getElementById('backToStart');
        const showResultsBtn = document.getElementById('showResults');
        const closeResultsBtn = document.getElementById('closeResults');
        
        const progressFill = document.getElementById('progressFill');
        const stepLabels = document.querySelectorAll('.step-label');
        
        // Datos locales para almacenar votos
        let votes = {
            Andres_Lopez : 0,
            Enrique_Pena: 0
        };
        
        // Verificar si hay datos almacenados en localStorage
        if (localStorage.getItem('votingData')) {
            votes = JSON.parse(localStorage.getItem('votingData'));
        }
        
        // Variables para seguimiento del voto actual
        let currentVote = {
            fullName: '',
            curp: '',
            candidate: ''
        };
        
        // Función para actualizar el progreso
        function updateProgress(step) {
            const progressWidths = ['33.33%', '66.66%', '100%'];
            progressFill.style.width = progressWidths[step - 1];
            
            stepLabels.forEach((label, index) => {
                if (index < step) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
        
        // Función para mostrar/ocultar secciones
        function showSection(sectionToShow) {
            const sections = [step1, step2, step3, confirmation, results];
            sections.forEach(section => section.classList.add('hidden'));
            resultsButton.classList.add('hidden');
            
            sectionToShow.classList.remove('hidden');
            if (sectionToShow === step1) {
                resultsButton.classList.remove('hidden');
            }
        }
        
        // Validación de formulario de votante
        nextToStep2Btn.addEventListener('click', function() {
            const fullName = fullNameInput.value.trim();
            const curp = curpInput.value.trim();
            let isValid = true;
            
            // Resetear estilos de validación
            fullNameInput.classList.remove('is-invalid');
            curpInput.classList.remove('is-invalid');
            
            // Validar nombre
            if (fullName === '' || fullName.length < 3) {
                fullNameInput.classList.add('is-invalid');
                isValid = false;
            }
            
            // Validar CURP (formato básico)
            const curpRegex = /^[A-Z0-9]{18}$/;
            if (!curpRegex.test(curp)) {
                curpInput.classList.add('is-invalid');
                isValid = false;
            }
            
            // Si los datos son válidos, avanzar al paso 2
            if (isValid) {
                currentVote.fullName = fullName;
                currentVote.curp = curp;
                
                showSection(step2);
                updateProgress(2);
                
                // Animación de entrada
                step2.style.opacity = '0';
                step2.style.transform = 'translateX(50px)';
                setTimeout(() => {
                    step2.style.transition = 'all 0.5s ease';
                    step2.style.opacity = '1';
                    step2.style.transform = 'translateX(0)';
                }, 50);
            }
        });
        
        // Selección de candidato
        candidateCards.forEach(card => {
            card.addEventListener('click', function() {
                // Quitar selección previa
                candidateCards.forEach(c => c.classList.remove('selected'));
                
                // Marcar este candidato como seleccionado
                this.classList.add('selected');
                
                // Guardar selección
                currentVote.candidate = this.dataset.candidate;
                
                // Animación de selección
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // Navegación entre pasos
        backToStep1Btn.addEventListener('click', function() {
            showSection(step1);
            updateProgress(1);
        });
        
        nextToStep3Btn.addEventListener('click', function() {
            // Verificar si se seleccionó un candidato
            if (!currentVote.candidate) {
                // Mostrar alerta Bootstrap
                const alertHtml = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Por favor seleccione un candidato para continuar.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                step2.insertAdjacentHTML('afterbegin', alertHtml);
                
                // Remover alerta después de 5 segundos
                setTimeout(() => {
                    const alert = step2.querySelector('.alert');
                    if (alert) alert.remove();
                }, 5000);
                
                return;
            }
            
            // Mostrar la información de confirmación
            confirmName.textContent = currentVote.fullName;
            confirmCurp.textContent = currentVote.curp;
            
            // Mostrar nombre del candidato
            let candidateName = currentVote.candidate === 'Andres_Lopez' ? 'Andrés Manuel López Obrador' : 'Enrique Peña Nieto';
            confirmCandidate.textContent = candidateName;
            
            showSection(step3);
            updateProgress(3);
            
            // Animación de entrada
            step3.style.opacity = '0';
            step3.style.transform = 'translateX(50px)';
            setTimeout(() => {
                step3.style.transition = 'all 0.5s ease';
                step3.style.opacity = '1';
                step3.style.transform = 'translateX(0)';
            }, 50);
        });
        
        backToStep2Btn.addEventListener('click', function() {
            showSection(step2);
            updateProgress(2);
        });
        
        // Procesar el voto
        submitVoteBtn.addEventListener('click', function() {
            // Mostrar indicador de carga
            submitVoteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
            submitVoteBtn.disabled = true;
            
            // Simular procesamiento
            setTimeout(() => {
                // Incrementar el contador del candidato seleccionado
                votes[currentVote.candidate]++;
                
                // Guardar datos en localStorage
                localStorage.setItem('votingData', JSON.stringify(votes));
                
                // Mostrar confirmación
                showSection(confirmation);
                
                // Resetear botón
                submitVoteBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Confirmar y Votar';
                submitVoteBtn.disabled = false;
                
                // Animación de éxito
                confirmation.style.opacity = '0';
                confirmation.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    confirmation.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    confirmation.style.opacity = '1';
                    confirmation.style.transform = 'scale(1)';
                }, 50);
            }, 2000);
        });
        
        // Volver al inicio después de votar
        backToStartBtn.addEventListener('click', function() {
            // Reiniciar formulario
            document.getElementById('voterForm').reset();
            candidateCards.forEach(card => card.classList.remove('selected'));
            
            // Reiniciar voto actual
            currentVote = {
                fullName: '',
                curp: '',
                candidate: ''
            };
            
            // Resetear estilos de validación
            fullNameInput.classList.remove('is-invalid');
            curpInput.classList.remove('is-invalid');
            
            // Mostrar paso 1
            showSection(step1);
            updateProgress(1);
        });
        
        // Mostrar resultados (solo para demostración)
        showResultsBtn.addEventListener('click', function() {
            updateResults();
            showSection(results);
            
            // Animación de entrada de resultados
            results.style.opacity = '0';
            results.style.transform = 'translateY(50px)';
            setTimeout(() => {
                results.style.transition = 'all 0.6s ease';
                results.style.opacity = '1';
                results.style.transform = 'translateY(0)';
            }, 50);
        });
        
        closeResultsBtn.addEventListener('click', function() {
            showSection(step1);
            updateProgress(1);
        });
        
        // Validación CURP (solo permitir números y letras)
        curpInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            // Remover clase de error mientras el usuario escribe
            if (this.classList.contains('is-invalid') && this.value.length > 0) {
                this.classList.remove('is-invalid');
            }
        });
        
        // Validación nombre en tiempo real
        fullNameInput.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim().length >= 3) {
                this.classList.remove('is-invalid');
            }
        });
        
        // Actualizar la visualización de resultados
        function updateResults() {
            const AndresLopezCount = document.getElementById('AndresLopezCount');
            const EnriquePenaCount = document.getElementById('EnriquePenaCount');
            const totalVotesEl = document.getElementById('totalVotes');
            const AndresLopezPercent = document.getElementById('AndresLopezPercent');
            const EnriquePenaPercent = document.getElementById('EnriquePenaPercent');
            const AndresLopezBar = document.getElementById('AndresLopezBar');
            const EnriquePenaBar = document.getElementById('EnriquePenaBar');
            
            const totalVotesCount = votes.Andres_Lopez + votes.Enrique_Pena;
            
            AndresLopezCount.textContent = votes.Andres_Lopez;
            EnriquePenaCount.textContent = votes.Enrique_Pena;
            totalVotesEl.textContent = totalVotesCount;
            
            // Calcular porcentajes
            let AndresLopezPercentage = 0;
            let EnriquePenaPercentage = 0;
            
            if (totalVotesCount > 0) {
                AndresLopezPercentage = Math.round((votes.Andres_Lopez / totalVotesCount) * 100);
                EnriquePenaPercentage = Math.round((votes.Enrique_Pena / totalVotesCount) * 100);
            }
            
            // Actualizar porcentajes y barras con animación
            setTimeout(() => {
                AndresLopezPercent.textContent = AndresLopezPercentage + '%';
                EnriquePenaPercent.textContent = EnriquePenaPercentage + '%';
                
                AndresLopezBar.style.width = AndresLopezPercentage + '%';
                EnriquePenaBar.style.width = EnriquePenaPercentage + '%';
            }, 300);
        }
        
        // Efectos de entrada para los elementos
        document.addEventListener('DOMContentLoaded', function() {
            // Animación inicial
            step1.style.opacity = '0';
            step1.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                step1.style.transition = 'all 0.6s ease';
                step1.style.opacity = '1';
                step1.style.transform = 'translateY(0)';
            }, 100);
        });
        
        // Validación mejorada de CURP
        function validateCURP(curp) {
            // Formato básico: 4 letras, 6 números, 6 alfanuméricos, 2 números
            const curpPattern = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/;
            return curpPattern.test(curp);
        }
        
        // Actualizar validación CURP
        curpInput.addEventListener('blur', function() {
            const curp = this.value.trim();
            if (curp.length === 18 && !validateCURP(curp)) {
                curpError.textContent = 'El formato de CURP no es válido.';
            } else {
                curpError.textContent = 'La CURP debe tener exactamente 18 caracteres alfanuméricos.';
            }
        });
        
        // Efecto de ripple para los botones
        document.querySelectorAll('.btn-custom').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Agregar CSS para animación ripple
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

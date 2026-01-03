'use client'
import React, { useState } from 'react';
import { Check, User, Mail, Phone, FileText, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function ConcursoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    concursos: [''],
    imagem: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConcursoChange = (index, value) => {
    const newConcursos = [...formData.concursos];
    newConcursos[index] = value;
    setFormData(prev => ({
      ...prev,
      concursos: newConcursos
    }));
  };

  const addConcurso = () => {
    setFormData(prev => ({
      ...prev,
      concursos: [...prev.concursos, '']
    }));
  };

  const removeConcurso = (index) => {
    if (formData.concursos.length > 1) {
      const newConcursos = formData.concursos.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        concursos: newConcursos
      }));
    }
  };

  const handleSubmit = async () => {
  setLoading(true);
  
  try {
    // Cria FormData conforme esperado pelo backend
    const formDataToSend = new FormData();
    
    // Cria o objeto de dados conforme AprovadoDTO
    const aprovadoData = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      concursos: formData.concursos.filter(c => c.trim() !== '') // Remove campos vazios
    };
    
    // Adiciona os dados como JSON string no campo "data"
    formDataToSend.append('data', JSON.stringify(aprovadoData));
    
    // Adiciona a imagem se existir
    if (formData.imagem) {
      formDataToSend.append('imagem', formData.imagem);
    }
    
    // Faz a requisição para o backend Java
    const response = await fetch('http://localhost:8080/api/aprovados', {
      method: 'POST',
      body: formDataToSend
      // Não definir 'Content-Type' header - FormData define automaticamente
      // com boundary para multipart/form-data
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do servidor:', errorText);
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Cadastro realizado com sucesso:', result);
    
    setLoading(false);
    setSubmitted(true);
    
    // Limpa formulário após sucesso
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        concursos: [''],
        imagem: null
      });
      setImagePreview(null);
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    setLoading(false);
    alert('Erro ao cadastrar. Verifique o console para mais detalhes.');
  }
};

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        imagem: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imagem: null
    }));
    setImagePreview(null);
  };

  const isFormValid = () => {
    return formData.nome.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.telefone.trim() !== '' &&
           formData.concursos.every(c => c.trim() !== '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-[#111184] px-8 py-10">
            <h1 className="text-3xl font-bold text-white text-center">
              Cadastro de Aprovados
            </h1>
            <p className="text-gray-200 text-center mt-2">
              Registre sua aprovação em concurso público
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-10 space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111184] focus:border-transparent transition-all placeholder:text-gray-500 text-gray-900"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111184] focus:border-transparent transition-all placeholder:text-gray-500 text-gray-900"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                  maxLength={15}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111184] focus:border-transparent transition-all placeholder:text-gray-500 text-gray-900"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* Concursos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Concursos Aprovados
              </label>
              <div className="space-y-3">
                {formData.concursos.map((concurso, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={concurso}
                        onChange={(e) => handleConcursoChange(index, e.target.value)}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111184] focus:border-transparent transition-all placeholder:text-gray-500 text-gray-900"
                        placeholder="Nome do concurso e cargo"
                      />
                    </div>
                    {formData.concursos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConcurso(index)}
                        className="px-3 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addConcurso}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#111184] hover:text-[#111184] transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar outro concurso
                </button>
              </div>
            </div>

            {/* Upload de Imagem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto (opcional)
              </label>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#111184] hover:bg-gray-50 transition-all">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG ou JPEG (máx. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || submitted || !isFormValid()}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all transform ${
                  submitted
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gradient-to-r from-black to-[#111184] hover:shadow-lg hover:scale-[1.02]'
                } disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : submitted ? (
                  <>
                    <Check className="h-6 w-6" />
                    Cadastro realizado com sucesso!
                  </>
                ) : (
                  'Cadastrar Aprovação'
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Seus dados serão armazenados com segurança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
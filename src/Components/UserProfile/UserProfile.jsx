import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserProfile.css';
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { updateUser } from '../../ReduxToolkit/userSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [editableUser, setEditableUser] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '********',
    phone: user.phone || '',
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    photo: false,
  });

  const [profilePhoto, setProfilePhoto] = useState(user.photoUrl || '');
  const [newPhoto, setNewPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          setProfilePhoto(doc.data().photoUrl || '');
        }
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleNameChange = () => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { name: editableUser.name })
        .then(() => {
          setMessage('Nombre actualizado exitosamente');
          dispatch(updateUser({ name: editableUser.name }));
          setIsEditing({ ...isEditing, name: false });
          setTimeout(() => setMessage(''), 3000);
        })
        .catch((error) => {
          console.error('Error al actualizar el nombre:', error);
          alert('Error al actualizar el nombre');
        });
    }
  };

  const handlePasswordChange = () => {
    if (currentUser) {
      updatePassword(currentUser, editableUser.password)
        .then(() => {
          setMessage('Contraseña modificada exitosamente');
          setIsEditing({ ...isEditing, password: false });
          setTimeout(() => setMessage(''), 3000);
        })
        .catch((error) => {
          console.error('Error al modificar la contraseña:', error);
          alert(`Error al modificar la contraseña: ${error.message}`);
        });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handlePhotoSave = () => {
    if (newPhoto && currentUser) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      uploadBytes(storageRef, newPhoto)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            const userRef = doc(db, 'users', currentUser.uid);
            updateDoc(userRef, { photoUrl: url })
              .then(() => {
                setProfilePhoto(url);
                setMessage('Imagen cargada exitosamente');
                setTimeout(() => setMessage(''), 3000);
              })
              .catch((error) => {
                console.error('Error al guardar la foto en la base de datos:', error);
                alert('Error al guardar la foto en la base de datos');
              });
          });
        })
        .catch((error) => {
          console.error('Error al cargar la foto en Firebase Storage:', error);
          alert('Error al cargar la foto');
        });
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?');
    if (confirmDelete) {
      deleteUser(currentUser)
        .then(() => {
          alert('Cuenta eliminada exitosamente');
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Error al eliminar la cuenta:', error);
          alert('Error al eliminar la cuenta');
        });
    }
  };

  // Función para eliminar la foto de perfil
  const handlePhotoDelete = () => {
    if (profilePhoto && currentUser) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      deleteObject(storageRef)
        .then(() => {
          // Eliminar URL de la foto del perfil de la base de datos
          const userRef = doc(db, 'users', currentUser.uid);
          updateDoc(userRef, { photoUrl: '' })
            .then(() => {
              setProfilePhoto('');
              setMessage('Foto eliminada exitosamente');
              setTimeout(() => setMessage(''), 3000);
            })
            .catch((error) => {
              console.error('Error al eliminar la foto de la base de datos:', error);
              alert('Error al eliminar la foto de la base de datos');
            });
        })
        .catch((error) => {
          console.error('Error al eliminar la foto en Firebase Storage:', error);
          alert('Error al eliminar la foto en Firebase Storage');
        });
    }
  };

  const toggleEditing = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  return (
    <div className="user-profile">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-left">
          <img
            src={profilePhoto || 'https://via.placeholder.com/100'}
            alt={`${editableUser.name}`}
            className="photo-header-small rounded-photo"
          />
          <div className="header-info">
            <h2>{editableUser.name}</h2>
            <p>{editableUser.email}</p>
          </div>
        </div>
        <button className="delete-account-button" onClick={handleDeleteAccount}>
          Eliminar Cuenta
        </button>
      </div>

      <div className="spacer"></div>

      {/* User Credentials Section */}
      <div className="user-credentials">
        <h3>Contraseña</h3>
        <div className="detail-item-column">
          {/* Eliminé la etiqueta duplicada "Contraseña" */}
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={editableUser.password}
              onChange={handleChange}
              disabled={!isEditing.password}
              placeholder="••••••••"
            />
            <button className="toggle-button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
            {isEditing.password ? (
              <button className="modify-button" onClick={handlePasswordChange}>
                Guardar
              </button>
            ) : (
              <button className="modify-button" onClick={() => toggleEditing('password')}>
                Modificar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="personal-info">
        <h3>Datos Personales</h3>
        <div className="profile-photo-large">
          <img
            src={profilePhoto || 'https://via.placeholder.com/200'}
            alt={`${editableUser.name}`}
            className="photo-large rounded-photo centered-photo"
          />
          <div className="photo-buttons">
            <button className="edit-button-small" onClick={() => document.getElementById('file-upload').click()}>
              Cargar
            </button>
            <button className="save-button-small" onClick={handlePhotoSave}>
              Guardar
            </button>
            <button className="delete-button-small" onClick={handlePhotoDelete}>
              Eliminar
            </button>
            <input id="file-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="upload-button-hidden" />
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item-column">
            <label htmlFor="name">Nombre:</label>
            <div className="input-container">
              <input
                type="text"
                id="name"
                name="name"
                value={editableUser.name}
                onChange={handleChange}
                disabled={!isEditing.name}
              />
              {isEditing.name ? (
                <button className="modify-button" onClick={handleNameChange}>
                  Guardar
                </button>
              ) : (
                <button className="modify-button" onClick={() => toggleEditing('name')}>
                  Modificar
                </button>
              )}
            </div>
          </div>

          <div className="detail-item-column">
            <label htmlFor="phone">Teléfono:</label>
            <div className="input-container">
              <input
                type="text"
                id="phone"
                name="phone"
                value={editableUser.phone}
                onChange={handleChange}
                disabled={!isEditing.phone}
              />
              {isEditing.phone ? (
                <button className="modify-button" onClick={() => toggleEditing('phone')}>
                  Guardar
                </button>
              ) : (
                <button className="modify-button" onClick={() => toggleEditing('phone')}>
                  Modificar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      {/* Additional Service Buttons */}
      <div className="create-publication-container">
        <button className="create-publication-button" onClick={() => navigate("/agregarFiesta")}>
          Crear Publicación
        </button>
      </div>

      <div className="additional-buttons">
        <button className="service-button">Ofrecer servicios 3D</button>
        <button className="service-button">Quiero ofrecer servicios como empresa</button>
      </div>
    </div>
  );
};

export default UserProfile;

"use client";

import { User } from "@/types/User";
import css from "./UserInfoComponent.module.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MyPetsItemComponent from "../MyPetsItemComponent/MyPetsItemComponent";
import LogoutConfirmComponent from "../LogoutConfirmComponent/LogoutConfirmComponent";
import Modal from "../Modal/Modal";
import EditUserProfileModalComponent from "../EditUserProfileModalComponent/EditUserProfileModalComponent";
import { uploadAvatar } from "@/lib/cloudinary/cloudinary";
import { editUser } from "@/lib/api/serverApi";

interface Props {
  currentUser: User | null;
}

export default function UserInfoComponent({ currentUser }: Props) {
  const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadAvatar(file);
      await editUser({ avatar: imageUrl });
      window.location.reload();
    } catch (error) {
      alert("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={css.userInfo}>
      <div className={css.box}>
        <div className={css.userTitle}>
          <p>User</p>
          <div className={css.userIconBg}>
            <svg width={18} height={18}>
              <use href="/symbol-defs.svg#user" />
            </svg>
          </div>
        </div>
        <button
          className={css.editBtn}
          onClick={() => setIsModalEditUserOpen(true)}
        >
          <svg width={18} height={18}>
            <use href="/symbol-defs.svg#pencil" />
          </svg>
        </button>
      </div>

      <div className={css.avatarWrapper}>
        {currentUser?.avatar ? (
          <Image
            src={currentUser.avatar}
            className={css.avatar}
            alt="User avatar"
            width={94}
            height={94}
            priority
          />
        ) : (
          <div className={css.iconBox}>
            <svg width={40} height={40} className={css.userIcon}>
              <use href="/symbol-defs.svg#user" />
            </svg>
          </div>
        )}

        <label className={css.uploadLabel}>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
            disabled={isUploading}
          />
          <div className={css.uploadContent}>
            <span>{isUploading ? "Uploading..." : "Upload photo"}</span>
            <svg width={18} height={18} className={css.uploadIcon}>
              <use href="/symbol-defs.svg#upload" />
            </svg>
          </div>
        </label>
      </div>

      <h3 className={css.subtitle}>My information</h3>
      <div className={css.userInfoWrapper}>
        <div className={css.infoItem}>
          {currentUser?.name || "Name not set"}
        </div>
        <div className={css.infoItem}>{currentUser?.email}</div>
        <div className={css.infoItem}>
          {currentUser?.phone ? currentUser.phone : "+380"}
        </div>
      </div>

      <div className={css.myPetsBox}>
        <h4>My pets</h4>
        <Link href="/add-pet" className={css.link}>
          Add pet
          <svg width={18} height={18}>
            <use href="/symbol-defs.svg#plus" />
          </svg>
        </Link>
      </div>

      {currentUser?.pets && currentUser.pets.length > 0 && (
        <ul className={css.list}>
          {currentUser.pets.map((item) => (
            <li key={item._id} className={css.listItem}>
              <MyPetsItemComponent pet={item} />
            </li>
          ))}
        </ul>
      )}

      <button className={css.logoutBtn} onClick={() => setIsLogoutOpen(true)}>
        LOG OUT
      </button>

      {isLogoutOpen && (
        <Modal onClose={() => setIsLogoutOpen(false)}>
          <LogoutConfirmComponent onClose={() => setIsLogoutOpen(false)} />
        </Modal>
      )}
      {isModalEditUserOpen && (
        <Modal onClose={() => setIsModalEditUserOpen(false)}>
          <EditUserProfileModalComponent
            onClose={() => setIsModalEditUserOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

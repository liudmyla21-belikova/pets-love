"use client";

import css from "./AddPetForm.module.css";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { addMyPet } from "@/lib/api/serverApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IFormInput {
  title: string;
  name: string;
  imgURL: any;
  species: string;
  birthday: string;
  sex: string;
}

export const addPetSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  name: Yup.string().required("Name is required"),
  imgURL: Yup.mixed().required("Image is required"),
  species: Yup.string()
    .oneOf([
      "dog",
      "cat",
      "monkey",
      "bird",
      "snake",
      "turtle",
      "lizard",
      "frog",
      "fish",
      "ants",
      "bees",
      "butterfly",
      "spider",
      "scorpion",
    ])
    .required("Species is required"),
  birthday: Yup.string().required("Birthday is required"),
  sex: Yup.string()
    .oneOf(["male", "female", "unknown"])
    .required("Sex is required"),
});

export default function AddPetForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<IFormInput>({
    resolver: yupResolver(addPetSchema) as any,
  });

  const fileWatcher = watch("imgURL");

  useEffect(() => {
    if (fileWatcher && fileWatcher.length > 0) {
      const file = fileWatcher[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [fileWatcher]);

  const onSubmit = async (data: IFormInput) => {
    try {
      const payload = {
        title: data.title,
        name: data.name,
        species: data.species,
        sex: data.sex,
        birthday: data.birthday,
        imgURL: "https://test.webp",
      };

      await addMyPet(payload);
      toast.success("Pet added!");
    } catch (error: any) {
      console.log("Error details:", error.response?.data);
    }
  };

  return (
    <div className={css.box}>
      <Toaster />
      <h3 className={css.title}>
        Add my pet / <span>Personal details</span>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className={css.editForm}>
        <div className={css.sexBox}>
          {["female", "male", "unknown"].map((s) => (
            <label key={s} className={css.radioLabel}>
              <input
                type="radio"
                className={css.sexInput}
                {...register("sex")}
                value={s}
              />
              <div
                className={`${css[`sexIconBox${s.charAt(0).toUpperCase() + s.slice(1)}`]} ${css.sexIconBox}`}
              >
                <svg width={20} height={20}>
                  <use href={`/symbol-defs.svg#${s}`} />
                </svg>
              </div>
            </label>
          ))}
          {errors.sex && <p className={css.errorText}>{errors.sex.message}</p>}
        </div>

        <div className={css.avatarContainer}>
          <div className={css.iconBox}>
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={68}
                height={68}
                className={css.avatarImg}
                unoptimized
              />
            ) : (
              <svg width={34} height={34}>
                <use href="/symbol-defs.svg#cat-footprint" />
              </svg>
            )}
          </div>
        </div>

        <div className={css.photoUploadWrapper}>
          <input
            className={css.input}
            placeholder="Enter URL"
            value={
              (typeof window !== "undefined" &&
                fileWatcher instanceof FileList &&
                fileWatcher[0]?.name) ||
              ""
            }
            readOnly
          />
          <label className={css.uploadLabelBtn}>
            <span>Upload photo</span>
            <input
              type="file"
              accept="image/*"
              className={css.hiddenInput}
              {...register("imgURL")}
            />
            <svg width={18} height={18} className={css.uploadIcon}>
              <use href="/symbol-defs.svg#upload" />
            </svg>
          </label>
        </div>

        <div className={css.inputsWrapper}>
          <div className={css.fieldBox}>
            <input
              {...register("title")}
              placeholder="Title"
              className={css.input}
            />
            {errors.title && (
              <p className={css.errorText}>{errors.title.message}</p>
            )}
          </div>

          <div className={css.fieldBox}>
            <input
              {...register("name")}
              placeholder="Pet’s Name"
              className={css.input}
            />
            {errors.name && (
              <p className={css.errorText}>{errors.name.message}</p>
            )}
          </div>

          <div className={css.rowInputs}>
            <div className={css.fieldBox}>
              <input
                type="date"
                {...register("birthday")}
                className={`${css.input} ${css.dateInput}`}
              />
              {errors.birthday && (
                <p className={css.errorText}>{errors.birthday.message}</p>
              )}
            </div>

            <div className={css.fieldBox}>
              <select
                {...register("species")}
                className={`${css.input} ${css.select}`}
              >
                <option value="">Type of pet</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="monkey">Monkey</option>
                <option value="bird">Bird</option>
                <option value="snake">Snake</option>
                <option value="turtle">Turtle</option>
                <option value="lizard">Lizard</option>
                <option value="frog">Frog</option>
                <option value="fish">Fish</option>
                <option value="ants">Ants</option>
                <option value="bees">Bees</option>
                <option value="butterfly">Butterfly</option>
                <option value="spider">Spider</option>
                <option value="scorpion">Scorpion</option>
              </select>
              {errors.species && (
                <p className={css.errorText}>{errors.species.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className={css.btnsBox}>
          <button
            type="button"
            className={`${css.btn} ${css.btnBack}`}
            onClick={() => router.push("/profile")}
          >
            Back
          </button>
          <button
            className={`${css.btn} ${css.btnSubmit}`}
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

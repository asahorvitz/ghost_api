#source ~/.bashrc
# If using CONDA replace ENV_NAME with env name. If using another package replace full line.
source activate ENV_NAME


data_dir="./"
cond_data="cond_prompt"
out_dir="./"
model_dir="./"
story_model_base="art_project_v1_uncased_sent_n_word_tok_thresh5_lr2.5"
vocab="art_project_v1_uncased_sent_n_word_tok_thresh5"
beam=5
temp=$1
story_out="${cond_data}.generated"

# generate results for sampling
python pytorch_src/generate_original.py --vocab ${model_dir}${vocab}.pkl \
--checkpoint ${model_dir}${story_model_base}.pt --task cond_generate \
--conditional-data ${data_dir}${cond_data} \
--temperature ${temp} --print-cond-data --words 150 --sampling-topk 15 \
--outf ${out_dir}${story_model_base}_sampling_temp${temp}.txt


# without discriminators applied                                                                                                                                                                            
#out_type="beamsearch"
#python pytorch_src/generate.py --vocab ${model_dir}${story_model_base}.pkl \
#--lm ${model_dir}${story_model_base}.pt --beam_size ${beam} \
#--data ${data_dir}${cond_data} \
#--out ${out_dir}${story_out}_${out_type} --print_cond_data --max_story_tokens 150

